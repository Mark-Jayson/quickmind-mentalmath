from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import SessionSubmit

app = FastAPI()


@app.post("/api/mathlympics/submit")
async def submit_session(request: Request):
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

    # Check for milestone badges
    await check_milestones(supabase, user["id"], session)

    return JSONResponse(result.data[0] if result.data else {}, status_code=201)


async def check_milestones(supabase, user_id: str, session: SessionSubmit):
    """Award badges based on session results."""
    badges_to_award = []

    # First session badge
    count = supabase.table("mathlympics_sessions").select("id", count="exact").eq("user_id", user_id).execute()
    if count.count == 1:
        badges_to_award.append("mathlympics_first_session")

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

    # Award badges (ignore duplicates via upsert)
    xp_earned = 0
    for badge_id in badges_to_award:
        try:
            supabase.table("user_badges").insert({
                "user_id": user_id,
                "badge_id": badge_id,
            }).execute()

            badge = supabase.table("badges").select("xp_reward").eq("id", badge_id).single().execute()
            if badge.data:
                xp_earned += badge.data.get("xp_reward", 0)
        except Exception:
            pass  # Badge already earned

    # Update XP
    if xp_earned > 0:
        profile = supabase.table("profiles").select("xp").eq("id", user_id).single().execute()
        current_xp = profile.data.get("xp", 0) if profile.data else 0
        supabase.table("profiles").update({"xp": current_xp + xp_earned}).eq("id", user_id).execute()
