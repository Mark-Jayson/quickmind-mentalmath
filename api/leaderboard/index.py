from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from .._lib.supabase import get_supabase

app = FastAPI()


@app.get("/api/leaderboard")
async def get_leaderboard(request: Request):
    category = request.query_params.get("category", "2x2")
    set_size = int(request.query_params.get("set_size", "10"))

    supabase = get_supabase()

    result = (
        supabase.table("mathlympics_sessions")
        .select("score, accuracy, total_time_ms, played_at, profiles!inner(username, display_name, avatar_url)")
        .eq("category", category)
        .eq("set_size", set_size)
        .order("accuracy", desc=True)
        .order("total_time_ms", desc=False)
        .limit(100)
        .execute()
    )

    entries = []
    for i, row in enumerate(result.data or []):
        entries.append({
            "rank": i + 1,
            "username": row["profiles"]["username"],
            "display_name": row["profiles"]["display_name"],
            "avatar_url": row["profiles"]["avatar_url"],
            "score": row["score"],
            "accuracy": row["accuracy"],
            "total_time_ms": row["total_time_ms"],
            "played_at": row["played_at"],
        })

    return JSONResponse(entries)
