from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase
from .._lib.auth import get_current_user

app = FastAPI()


@app.get("/api/mathlympics/history")
async def get_history(request: Request):
    user = await get_current_user(request)
    supabase = get_supabase()

    result = (
        supabase.table("mathlympics_sessions")
        .select("*")
        .eq("user_id", user["id"])
        .order("played_at", desc=True)
        .limit(50)
        .execute()
    )

    return JSONResponse(result.data)
