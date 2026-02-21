from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user
from .._lib.models import ProfileUpdate

router = APIRouter()


@router.get("/auth/profile")
async def get_profile(request: Request):
    user = await get_current_user(request)
    supabase = get_supabase()

    result = supabase.table("profiles").select("*").eq("id", user["id"]).execute()
    return JSONResponse(result.data[0] if result.data else {})


@router.put("/auth/profile")
async def update_profile(request: Request):
    user = await get_current_user(request)
    body = await request.json()
    updates = ProfileUpdate(**body)

    supabase = get_supabase()
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}

    result = (
        supabase.table("profiles")
        .update(update_data)
        .eq("id", user["id"])
        .execute()
    )
    return JSONResponse(result.data[0] if result.data else {})
