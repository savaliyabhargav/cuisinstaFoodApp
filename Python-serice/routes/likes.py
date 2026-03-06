from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import get_db

router = APIRouter()

class LikeRequest(BaseModel):
    user_id: str
    reel_id: str

@router.post("/like")
def toggle_like(req: LikeRequest):
    db = get_db()

    # Check user exists
    user = db.users.find_one({"user_id": req.user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{req.user_id}' not found. Call /feed first.")

    # Check reel exists
    reel = db.reels.find_one({"reel_id": req.reel_id})
    if not reel:
        raise HTTPException(status_code=404, detail=f"Reel '{req.reel_id}' not found.")

    liked_reels = user.get("liked_reels", [])
    category = reel["category"]

    if req.reel_id not in liked_reels:
        # Like
        db.users.update_one(
            {"user_id": req.user_id},
            {
                "$addToSet": {"liked_reels": req.reel_id},
                "$inc": {f"category_likes.{category}": 1}
            }
        )
        db.reels.update_one({"reel_id": req.reel_id}, {"$inc": {"like_count": 1}})
        action = "liked"
        new_like_count = reel["like_count"] + 1
    else:
        # Unlike
        db.users.update_one(
            {"user_id": req.user_id},
            {
                "$pull": {"liked_reels": req.reel_id},
                "$inc": {f"category_likes.{category}": -1}
            }
        )
        db.reels.update_one({"reel_id": req.reel_id}, {"$inc": {"like_count": -1}})
        action = "unliked"
        new_like_count = reel["like_count"] - 1

    # Recalculate top 5 interests
    updated_user = db.users.find_one({"user_id": req.user_id})
    category_likes = updated_user.get("category_likes", {})
    top_5 = sorted(category_likes, key=category_likes.get, reverse=True)[:5]
    top_5 = [c for c in top_5 if category_likes[c] > 0]

    db.users.update_one(
        {"user_id": req.user_id},
        {"$set": {"interests": top_5 if top_5 else None}}
    )

    return {
        "action": action,
        "reel_id": req.reel_id,
        "new_like_count": new_like_count,
        "updated_interests": top_5
    }