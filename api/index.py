from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()


@app.get("/api")
async def health():
    return JSONResponse({"status": "ok", "service": "quickmind-api"})
