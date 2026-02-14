from fastapi import FastAPI
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase

app = FastAPI()


@app.get("/api/lessons")
async def get_lessons():
    supabase = get_supabase()

    result = (
        supabase.table("lessons")
        .select("*")
        .order("sort_order", desc=False)
        .execute()
    )

    return JSONResponse(result.data)
