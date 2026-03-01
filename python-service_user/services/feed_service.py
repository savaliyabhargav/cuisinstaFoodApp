from firebase import db
import random

def build_reel_object(reel_id: str, reel_data: dict, user_id: str, user_likes: list):
    restaurant_doc = db.collection("restaurants").document(reel_data["restaurant_id"]).get()
    restaurant = restaurant_doc.to_dict()

    return {
        "reel_id": reel_id,
        "category": reel_data["category"],
        "like_count": reel_data["like_count"],
        "did_i_like": reel_id in user_likes,
        "restaurant": {
            "restaurant_id": reel_data["restaurant_id"],
            "name": restaurant["name"],
            "profile_image": restaurant["profile_image"]
        }
    }

def get_feed(user_id: str, count: int):
    # fetch all reels from firestore
    all_reels_docs = db.collection("reels").stream()
    all_reels = {doc.id: doc.to_dict() for doc in all_reels_docs}
    all_reel_ids = list(all_reels.keys())

    # fetch user from firestore
    user_doc = db.collection("users").document(user_id).get()

    # fetch seen reels
    seen_doc = db.collection("seen_reels").document(user_id).get()
    seen_reels = set(seen_doc.to_dict().get("seen", [])) if seen_doc.exists else set()

    # fetch user likes
    likes_doc = db.collection("user_likes").document(user_id).get()
    user_likes = likes_doc.to_dict().get("liked_reels", []) if likes_doc.exists else []

    # --- new user ---
    if not user_doc.exists:
        db.collection("users").document(user_id).set({
            "interests": None,
            "category_likes": {}
        })

        sampled = random.sample(all_reel_ids, min(20, len(all_reel_ids)))

        db.collection("seen_reels").document(user_id).set({"seen": sampled})

        feed = [build_reel_object(r, all_reels[r], user_id, user_likes) for r in sampled]

        return {
            "user_id": user_id,
            "is_new_user": True,
            "interests": None,
            "feed": feed
        }

    # --- existing user ---
    user_data = user_doc.to_dict()
    interests = user_data.get("interests")

    # get interest matched reels
    if interests:
        matched_reels = [r for r, data in all_reels.items() if data["category"] in interests]
    else:
        matched_reels = all_reel_ids

    # unseen matched reels
    unseen_matched = [r for r in matched_reels if r not in seen_reels]

    feed_ids = []
    is_randomized = False

    # fill from interest matched first
    random.shuffle(unseen_matched)
    feed_ids.extend(unseen_matched[:count])

    # top up from random unseen if not enough
    if len(feed_ids) < count:
        is_randomized = True
        unseen_random = [
            r for r in all_reel_ids
            if r not in seen_reels and r not in feed_ids
        ]
        random.shuffle(unseen_random)
        feed_ids.extend(unseen_random[:count - len(feed_ids)])

    # if still not enough reset seen and fill rest
    if len(feed_ids) < count:
        seen_reels = set()
        is_randomized = True
        remaining = [r for r in all_reel_ids if r not in feed_ids]
        random.shuffle(remaining)
        feed_ids.extend(remaining[:count - len(feed_ids)])

    # update seen reels in firestore
    updated_seen = list(seen_reels.union(set(feed_ids)))
    db.collection("seen_reels").document(user_id).set({"seen": updated_seen})

    feed = [build_reel_object(r, all_reels[r], user_id, user_likes) for r in feed_ids]

    return {
        "user_id": user_id,
        "is_new_user": False,
        "is_randomized": is_randomized,
        "interests": interests,
        "feed": feed
    }