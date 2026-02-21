from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user

router = APIRouter()


@router.get("/badges")
async def get_badges(request: Request):
    user = await get_current_user(request)
    supabase = get_supabase()

    result = (
        supabase.table("user_badges")
        .select("earned_at, metadata, badges(*)")
        .eq("user_id", user["id"])
        .order("earned_at", desc=True)
        .execute()
    )

    badges = []
    for row in result.data or []:
        badge = row.get("badges", {})
        badge["earned_at"] = row["earned_at"]
        badge["metadata"] = row.get("metadata")
        badges.append(badge)

    return JSONResponse(badges)
