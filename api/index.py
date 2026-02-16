from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.responses import JSONResponse

import os

# Try to load .env from root
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(root_dir, '.env')

if os.path.exists(env_path):
    print(f"DEBUG: Found .env at {env_path}")
    load_dotenv(env_path)
else:
    print(f"DEBUG: .env NOT found at {env_path}, falling back to default load_dotenv()")
    load_dotenv()

from .lessons.progress import router as lessons_progress_router
from .lessons.index import router as lessons_index_router
from .mathlympics.submit import router as mathlympics_submit_router
from .badges.index import router as badges_router
from .leaderboard.index import router as leaderboard_router
from .auth.profile import router as profile_router

app = FastAPI()

# Include all routers with /api prefix
app.include_router(lessons_progress_router, prefix="/api")
app.include_router(lessons_index_router, prefix="/api")
app.include_router(mathlympics_submit_router, prefix="/api")
app.include_router(badges_router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")
app.include_router(profile_router, prefix="/api")


@app.get("/api")
async def health():
    url = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL')
    print(f"DEBUG: Health check - SUPABASE_URL: {url}")
    if not url:
        print("CRITICAL: SUPABASE_URL is NOT LOADED in api/index.py health check!")
    return JSONResponse({"status": "ok", "service": "quickmind-api"})

