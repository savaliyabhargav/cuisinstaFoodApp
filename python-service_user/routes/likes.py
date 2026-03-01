from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.like_service import toggle_like
from mock_data import REELS, USER_INTERESTS

router = APIRouter()

class LikeRequest(BaseModel):
    user_id: str
    reel_id: str

@router.post("/like")
def like_endpoint(req: LikeRequest):
    if req.reel_id not in REELS:
        raise HTTPException(status_code=404, detail=f"Reel '{req.reel_id}' not found")
    if req.user_id not in USER_INTERESTS:
        raise HTTPException(status_code=404, detail=f"User '{req.user_id}' not found, call /feed first to register user")

    return toggle_like(req.user_id, req.reel_id)