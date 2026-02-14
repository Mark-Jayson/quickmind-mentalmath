from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import LessonComplete

app = FastAPI()


@app.get("/api/lessons/progress")
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


@app.post("/api/lessons/progress")
async def complete_lesson(request: Request):
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
    lesson = (
        supabase.table("lessons")
        .select("badge_id")
        .eq("id", completion.lesson_id)
        .single()
        .execute()
    )

    if lesson.data and lesson.data.get("badge_id"):
        badge_id = lesson.data["badge_id"]
        try:
            supabase.table("user_badges").insert({
                "user_id": user["id"],
                "badge_id": badge_id,
            }).execute()

            # Award XP
            badge = supabase.table("badges").select("xp_reward").eq("id", badge_id).single().execute()
            if badge.data:
                xp = badge.data.get("xp_reward", 0)
                profile = supabase.table("profiles").select("xp").eq("id", user["id"]).single().execute()
                current_xp = profile.data.get("xp", 0) if profile.data else 0
                supabase.table("profiles").update({"xp": current_xp + xp}).eq("id", user["id"]).execute()
        except Exception:
            pass  # Already earned

    return JSONResponse(result.data[0] if result.data else {}, status_code=201)
