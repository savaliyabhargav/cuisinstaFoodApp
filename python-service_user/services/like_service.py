from mongodb import db

def toggle_like(user_id: str, reel_id: str):
    reel = db.reels.find_one({"_id": reel_id})
    user = db.users.find_one({"_id": user_id})
    likes_doc = db.user_likes.find_one({"_id": user_id})

    category = reel["category"]
    liked_reels = likes_doc["liked_reels"] if likes_doc else []
    already_liked = reel_id in liked_reels
    category_likes = user.get("category_likes", {})
    current_like_count = reel["like_count"]

    if already_liked:
        # unlike
        db.user_likes.update_one(
            {"_id": user_id},
            {"$pull": {"liked_reels": reel_id}},
            upsert=True
        )
        db.reels.update_one({"_id": reel_id}, {"$inc": {"like_count": -1}})
        category_likes[category] = max(0, category_likes.get(category, 0) - 1)
        action = "unliked"
        new_like_count = current_like_count - 1
    else:
        # like
        db.user_likes.update_one(
            {"_id": user_id},
            {"$push": {"liked_reels": reel_id}},
            upsert=True
        )
        db.reels.update_one({"_id": reel_id}, {"$inc": {"like_count": 1}})
        category_likes[category] = category_likes.get(category, 0) + 1
        action = "liked"
        new_like_count = current_like_count + 1

    # recalculate top 5 interests
    top5 = sorted(category_likes, key=category_likes.get, reverse=True)[:5] if category_likes else None

    # update user
    db.users.update_one(
        {"_id": user_id},
        {"$set": {"category_likes": category_likes, "interests": top5}}
    )

    return {
        "action": action,
        "reel_id": reel_id,
        "new_like_count": new_like_count,
        "updated_interests": top5
    }