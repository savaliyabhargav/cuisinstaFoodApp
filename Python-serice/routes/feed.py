from fastapi import APIRouter, Query
from db.database import get_db
import random

router = APIRouter()

@router.get("/feed/{user_id}")
def get_feed(user_id: str, count: int = Query(default=10)):
    db = get_db()

    user = db.users.find_one({"user_id": user_id})

    # New user — create and return random reels
    if not user:
        db.users.insert_one({
            "user_id": user_id,
            "interests": None,
            "liked_reels": [],
            "seen_reels": [],
            "category_likes": {},
            "category_watch_time": {}
        })
        all_reels = list(db.reels.find())
        selected = random.sample(all_reels, min(count, len(all_reels)))
        return {
            "user_id": user_id,
            "is_new_user": True,
            "interests": None,
            "feed": build_feed(selected, [], db)
        }

    interests = user.get("interests", None)
    liked = user.get("liked_reels", [])

    if interests:
        # 6 out of 10 from user interests, rest random from anything
        interest_count = round(count * 0.6)
        random_count = count - interest_count

        interest_reels = list(db.reels.find({"category": {"$in": interests}}))
        all_reels = list(db.reels.find())

        interest_selected = random.sample(interest_reels, min(interest_count, len(interest_reels)))
        interest_ids = [r["reel_id"] for r in interest_selected]

        remaining = [r for r in all_reels if r["reel_id"] not in interest_ids]
        random_selected = random.sample(remaining, min(random_count, len(remaining)))

        selected = interest_selected + random_selected
        random.shuffle(selected)
    else:
        # No interests — fully random
        all_reels = list(db.reels.find())
        selected = random.sample(all_reels, min(count, len(all_reels)))

    return {
        "user_id": user_id,
        "is_new_user": False,
        "interests": interests,
        "feed": build_feed(selected, liked, db)
    }


def build_feed(reels, liked_reels, db):
    feed = []
    for reel in reels:
        restaurant = db.restaurants.find_one({"restaurant_id": reel["restaurant_id"]})
        feed.append({
            "reel_id": reel["reel_id"],
            "category": reel["category"],
            "like_count": reel["like_count"],
            "did_i_like": reel["reel_id"] in liked_reels,
            "restaurant": {
                "restaurant_id": restaurant["restaurant_id"],
                "name": restaurant["name"],
                "profile_image": restaurant["profile_image"]
            }
        })
    return feed