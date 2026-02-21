from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import SessionSubmit

router = APIRouter()


@router.post("/mathlympics/submit")
async def submit_session(request: Request):
    try:
        user = await get_current_user(request)
        body = await request.json()
        session = SessionSubmit(**body)

        supabase = get_supabase()

        result = (
            supabase.table("mathlympics_sessions")
            .insert({
                "user_id": user["id"],
                "category": session.category,
                "set_size": session.set_size,
                "score": session.score,
                "accuracy": session.accuracy,
                "total_time_ms": session.total_time_ms,
                "avg_time_ms": session.avg_time_ms,
                "detail": session.detail,
            })
            .execute()
        )

        # result.data is a list of inserted rows
        if not result.data:
            return JSONResponse({"error": "Failed to insert session"}, status_code=500)

        # Check for milestone badges
        new_badges = await check_milestones(supabase, user["id"], session)

        response_data = result.data[0]
        response_data["new_badges"] = new_badges

        return JSONResponse(response_data, status_code=201)
    except Exception as e:
        print(f"Error in submit_session: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)


async def check_milestones(supabase, user_id: str, session: SessionSubmit):
    """Award badges based on session results."""
    badges_to_award = []

    # First session badge
    count = supabase.table("mathlympics_sessions").select("id", count="exact").eq("user_id", user_id).execute()
    if count.count == 1:
        badges_to_award.append("mathlympics_first_session")

    # 100 sessions milestone
    if count.count is not None and count.count >= 100:
        badges_to_award.append("milestone_100_sessions")

    # Perfect score badges
    if session.accuracy == 1.0:
        perfect_badges = {
            "2x1": "mathlympics_2x1_perfect",
            "3x1": "mathlympics_3x1_perfect",
            "2x2": "mathlympics_2x2_perfect",
            "squaring": "mathlympics_squaring_perfect",
        }
        if session.category in perfect_badges:
            badges_to_award.append(perfect_badges[session.category])

    # Speed demon (avg < 5s)
    if session.avg_time_ms < 5000:
        badges_to_award.append("mathlympics_speed_demon")

    # 40-question marathon
    if session.set_size == 40:
        badges_to_award.append("mathlympics_40_set")

    # ── Leaderboard Top 3 Medal Badges ──
    # Query the leaderboard for this category & set_size, ordered by accuracy
    # DESC then total_time_ms ASC, and check the user's rank.
    try:
        leaderboard = (
            supabase.table("mathlympics_sessions")
            .select("user_id, accuracy, total_time_ms")
            .eq("category", session.category)
            .eq("set_size", session.set_size)
            .order("accuracy", desc=True)
            .order("total_time_ms", desc=False)
            .limit(3)
            .execute()
        )

        if leaderboard.data:
            medal_map = {0: "medal_gold", 1: "medal_silver", 2: "medal_bronze"}
            for rank_idx, entry in enumerate(leaderboard.data):
                if entry["user_id"] == user_id:
                    badges_to_award.append((medal_map[rank_idx], {"category": session.category}))
                    break
    except Exception as e:
        print(f"Leaderboard medal check error: {e}")

    # Award badges (ignore duplicates via upsert)
    xp_earned = 0
    new_badges = []

    for entry in badges_to_award:
        # Entry can be a plain badge_id string or a (badge_id, metadata) tuple
        if isinstance(entry, tuple):
            badge_id, metadata = entry
        else:
            badge_id, metadata = entry, None

        # Check if already earned
        existing = supabase.table("user_badges").select("id, metadata").eq("user_id", user_id).eq("badge_id", badge_id).execute()
        
        already_earned = False
        if existing.data:
            if not metadata:
                already_earned = True
            else:
                for row in existing.data:
                    if row.get("metadata") == metadata:
                        already_earned = True
                        break
        
        if not already_earned:
            insert_data = {
                "user_id": user_id,
                "badge_id": badge_id,
            }
            if metadata:
                insert_data["metadata"] = metadata
            supabase.table("user_badges").insert(insert_data).execute()

            # Get badge details for response and XP
            badge_res = supabase.table("badges").select("*").eq("id", badge_id).execute()
            badge_item = badge_res.data[0] if badge_res.data else None
            if badge_item:
                if metadata:
                    badge_item["metadata"] = metadata
                xp_earned += badge_item.get("xp_reward", 0)
                new_badges.append(badge_item)

    # Update XP
    if xp_earned > 0:
        prof_res = supabase.table("profiles").select("xp").eq("id", user_id).execute()
        prof_data = prof_res.data[0] if prof_res.data else None
        current_xp = prof_data.get("xp", 0) if prof_data else 0
        supabase.table("profiles").update({"xp": current_xp + xp_earned}).eq("id", user_id).execute()
        
    return new_badges
