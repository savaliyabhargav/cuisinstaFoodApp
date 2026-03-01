from firebase import db
from google.cloud.firestore import ArrayUnion, ArrayRemove

def toggle_like(user_id: str, reel_id: str):
    reel_ref = db.collection("reels").document(reel_id)
    user_ref = db.collection("users").document(user_id)
    likes_ref = db.collection("user_likes").document(user_id)

    reel_doc = reel_ref.get()
    reel_data = reel_doc.to_dict()
    category = reel_data["category"]

    likes_doc = likes_ref.get()
    liked_reels = likes_doc.to_dict().get("liked_reels", []) if likes_doc.exists else []

    already_liked = reel_id in liked_reels

    user_doc = user_ref.get()
    user_data = user_doc.to_dict()
    category_likes = user_data.get("category_likes", {})

    if already_liked:
        # unlike
        likes_ref.set({"liked_reels": ArrayRemove([reel_id])}, merge=True)
        reel_ref.update({"like_count": reel_data["like_count"] - 1})
        category_likes[category] = max(0, category_likes.get(category, 0) - 1)
        action = "unliked"
        new_like_count = reel_data["like_count"] - 1
    else:
        # like
        likes_ref.set({"liked_reels": ArrayUnion([reel_id])}, merge=True)
        reel_ref.update({"like_count": reel_data["like_count"] + 1})
        category_likes[category] = category_likes.get(category, 0) + 1
        action = "liked"
        new_like_count = reel_data["like_count"] + 1

    # recalculate top 5 interests
    if category_likes:
        top5 = sorted(category_likes, key=category_likes.get, reverse=True)[:5]
    else:
        top5 = None

    # update user in firestore
    user_ref.update({
        "category_likes": category_likes,
        "interests": top5
    })

    return {
        "action": action,
        "reel_id": reel_id,
        "new_like_count": new_like_count,
        "updated_interests": top5
    }