from pydantic import BaseModel
from typing import Optional, List, Any


class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None


class SessionSubmit(BaseModel):
    category: str
    set_size: int
    score: int
    accuracy: float
    total_time_ms: int
    avg_time_ms: int
    detail: Optional[List[Any]] = None


class LessonComplete(BaseModel):
    lesson_id: str
    quiz_score: Optional[int] = None
