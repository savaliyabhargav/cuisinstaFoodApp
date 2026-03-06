from mongodb import db
import random

def build_reel_object(reel_id: str, reel_data: dict, user_id: str, user_likes: list):
    restaurant = db.restaurants.find_one({"_id": reel_data["restaurant_id"]})

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
    # fetch all reels
    all_reels = {doc["_id"]: doc for doc in db.reels.find()}
    all_reel_ids = list(all_reels.keys())

    # fetch user
    user = db.users.find_one({"_id": user_id})

    # fetch seen reels
    seen_doc = db.seen_reels.find_one({"_id": user_id})
    seen_reels = set(seen_doc["seen"]) if seen_doc else set()

    # fetch user likes
    likes_doc = db.user_likes.find_one({"_id": user_id})
    user_likes = likes_doc["liked_reels"] if likes_doc else []

    # --- new user ---
    if not user:
        db.users.insert_one({
            "_id": user_id,
            "interests": None,
            "category_likes": {}
        })

        sampled = random.sample(all_reel_ids, min(20, len(all_reel_ids)))

        db.seen_reels.insert_one({"_id": user_id, "seen": sampled})

        feed = [build_reel_object(r, all_reels[r], user_id, user_likes) for r in sampled]

        return {
            "user_id": user_id,
            "is_new_user": True,
            "interests": None,
            "feed": feed
        }

    # --- existing user ---
    interests = user.get("interests")

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

    # update seen reels in mongodb
    updated_seen = list(seen_reels.union(set(feed_ids)))
    db.seen_reels.update_one(
        {"_id": user_id},
        {"$set": {"seen": updated_seen}},
        upsert=True
    )

    feed = [build_reel_object(r, all_reels[r], user_id, user_likes) for r in feed_ids]

    return {
        "user_id": user_id,
        "is_new_user": False,
        "is_randomized": is_randomized,
        "interests": interests,
        "feed": feed
    }