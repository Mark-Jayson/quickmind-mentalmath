from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import LessonComplete

router = APIRouter()
app = FastAPI()

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
                "completed_at": "now()",
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
        if lesson_data and lesson_data.get("badge_id"):
            badge_id = lesson_data["badge_id"]
            # Check if already earned
            existing = supabase.table("user_badges").select("id").eq("user_id", user["id"]).eq("badge_id", badge_id).execute()
            
            if not existing.data:
                supabase.table("user_badges").insert({
                    "user_id": user["id"],
                    "badge_id": badge_id,
                }).execute()

                # Award XP
                badge_result = supabase.table("badges").select("*").eq("id", badge_id).execute()
                badge_data = badge_result.data[0] if badge_result.data else None
                
                if badge_data:
                    xp = badge_data.get("xp_reward", 0)
                    profile_result = supabase.table("profiles").select("xp").eq("id", user["id"]).execute()
                    profile_data = profile_result.data[0] if profile_result.data else None
                    
                    current_xp = profile_data.get("xp", 0) if profile_data else 0
                    supabase.table("profiles").update({"xp": current_xp + xp}).eq("id", user["id"]).execute()
                    new_badges.append(badge_data)

        response_data = result.data[0] if result.data else {}
        response_data["new_badges"] = new_badges
        
        return JSONResponse(response_data, status_code=201)
    except Exception as e:
        print(f"Error completing lesson: {str(e)}")
        return JSONResponse({"error": str(e)}, status_code=500)