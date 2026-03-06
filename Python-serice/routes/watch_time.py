from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.database import get_db

router = APIRouter()

class WatchTimeRequest(BaseModel):
    user_id: str
    category: str
    seconds_watched: float

@router.post("/watch-time")
def record_watch_time(req: WatchTimeRequest):
    db = get_db()

    # Check user exists
    user = db.users.find_one({"user_id": req.user_id})
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{req.user_id}' not found. Call /feed first.")

    # Add watch time to that category
    db.users.update_one(
        {"user_id": req.user_id},
        {"$inc": {f"category_watch_time.{req.category}": req.seconds_watched}}
    )

    # Recalculate interests combining likes + watch time
    updated_user = db.users.find_one({"user_id": req.user_id})
    category_likes = updated_user.get("category_likes", {})
    category_watch_time = updated_user.get("category_watch_time", {})

    # Get all categories from both
    all_categories = set(list(category_likes.keys()) + list(category_watch_time.keys()))

    # Score = likes * 10 + watch_time_in_seconds
    scores = {}
    for cat in all_categories:
        likes_score = category_likes.get(cat, 0) * 10
        watch_score = category_watch_time.get(cat, 0)
        scores[cat] = likes_score + watch_score

    top_5 = sorted(scores, key=scores.get, reverse=True)[:5]
    top_5 = [c for c in top_5 if scores[c] > 0]

    db.users.update_one(
        {"user_id": req.user_id},
        {"$set": {"interests": top_5 if top_5 else None}}
    )

    return {
        "user_id": req.user_id,
        "category": req.category,
        "seconds_watched": req.seconds_watched,
        "updated_interests": top_5
    }