from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.like_service import toggle_like
from mongodb import db

router = APIRouter()

class LikeRequest(BaseModel):
    user_id: str
    reel_id: str

@router.post("/like")
def like_endpoint(req: LikeRequest):
    if not db.reels.find_one({"_id": req.reel_id}):
        raise HTTPException(status_code=404, detail=f"Reel '{req.reel_id}' not found")
    if not db.users.find_one({"_id": req.user_id}):
        raise HTTPException(status_code=404, detail=f"User '{req.user_id}' not found, call /feed first to register")

    return toggle_like(req.user_id, req.reel_id)