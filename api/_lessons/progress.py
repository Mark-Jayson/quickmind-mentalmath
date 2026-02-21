from datetime import datetime, timezone

from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import LessonComplete

router = APIRouter()

@router.get("/lessons/progress")
async def get_progress(request: Request):
    user = await get_current_user(request)
    supabase = get_supabase()

    result = (
        supabase.table("user_lesson_progress")
        .select("*")
        .eq("user_id", user["id"])
        .execute()
    )

    return JSONResponse(result.data)


@router.post("/lessons/progress")
async def complete_lesson(request: Request):
    try:
        user = await get_current_user(request)
        body = await request.json()
        completion = LessonComplete(**body)

        supabase = get_supabase()

        # Upsert progress
        result = (
            supabase.table("user_lesson_progress")
            .upsert({
                "user_id": user["id"],
                "lesson_id": completion.lesson_id,
                "completed": True,
                "quiz_score": completion.quiz_score,
                "completed_at": datetime.now(timezone.utc).isoformat(),
            })
            .execute()
        )

        # Award lesson badge
        lesson_result = (
            supabase.table("lessons")
            .select("badge_id")
            .eq("id", completion.lesson_id)
            .execute()
        )
        
        lesson_data = lesson_result.data[0] if lesson_result.data else None

        new_badges = []
        xp_earned = 0

        if lesson_data and lesson_data.get("badge_id"):
            badge_id = lesson_data["badge_id"]
            # Check if already earned
            existing = supabase.table("user_badges").select("id").eq("user_id", user["id"]).eq("badge_id", badge_id).execute()
            
            if not existing.data:
                supabase.table("user_badges").insert({
                    "user_id": user["id"],
                    "badge_id": badge_id,
                }).execute()

                # Get badge details for response and XP
                badge_result = supabase.table("badges").select("*").eq("id", badge_id).execute()
                badge_data = badge_result.data[0] if badge_result.data else None
                
                if badge_data:
                    xp_earned += badge_data.get("xp_reward", 0)
                    new_badges.append(badge_data)

        # ── Check milestone: all lessons completed ──
        try:
            total_lessons = supabase.table("lessons").select("id", count="exact").execute()
            completed_lessons = (
                supabase.table("user_lesson_progress")
                .select("id", count="exact")
                .eq("user_id", user["id"])
                .eq("completed", True)
                .execute()
            )
            
            if (total_lessons.count is not None 
                and completed_lessons.count is not None 
                and completed_lessons.count >= total_lessons.count
                and total_lessons.count > 0):
                
                # Check if milestone_all_lessons already earned
                existing_milestone = (
                    supabase.table("user_badges")
                    .select("id")
                    .eq("user_id", user["id"])
                    .eq("badge_id", "milestone_all_lessons")
                    .execute()
                )
                
                if not existing_milestone.data:
                    supabase.table("user_badges").insert({
                        "user_id": user["id"],
                        "badge_id": "milestone_all_lessons",
                    }).execute()
                    
                    milestone_badge = supabase.table("badges").select("*").eq("id", "milestone_all_lessons").execute()
                    if milestone_badge.data:
                        xp_earned += milestone_badge.data[0].get("xp_reward", 0)
                        new_badges.append(milestone_badge.data[0])
        except Exception as e:
            print(f"All-lessons milestone check error: {e}")

        # Award XP
        if xp_earned > 0:
            profile_result = supabase.table("profiles").select("xp").eq("id", user["id"]).execute()
            profile_data = profile_result.data[0] if profile_result.data else None
            current_xp = profile_data.get("xp", 0) if profile_data else 0
            supabase.table("profiles").update({"xp": current_xp + xp_earned}).eq("id", user["id"]).execute()

        response_data = result.data[0] if result.data else {}
        response_data["new_badges"] = new_badges
        
        return JSONResponse(response_data, status_code=201)
    except Exception as e:
        print(f"Error completing lesson: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)