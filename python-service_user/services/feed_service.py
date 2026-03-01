from mock_data import REELS, RESTAURANTS, USER_INTERESTS, SEEN_REELS, USER_LIKES
import random

def build_reel_object(reel_id: str, user_id: str):
    reel = REELS[reel_id]
    restaurant = RESTAURANTS[reel["restaurant_id"]]
    did_i_like = reel_id in USER_LIKES.get(user_id, set())

    return {
        "reel_id": reel_id,
        "category": reel["category"],
        "like_count": reel["like_count"],
        "did_i_like": did_i_like,
        "restaurant": {
            "restaurant_id": reel["restaurant_id"],
            "name": restaurant["name"],
            "profile_image": restaurant["profile_image"]
        }
    }

def get_feed(user_id: str, count: int):
    all_reel_ids = list(REELS.keys())

    # --- new user ---
    if user_id not in USER_INTERESTS:
        USER_INTERESTS[user_id] = None
        SEEN_REELS[user_id] = set()

        sampled = random.sample(all_reel_ids, min(20, len(all_reel_ids)))
        SEEN_REELS[user_id].update(sampled)

        feed = [build_reel_object(r, user_id) for r in sampled]

        return {
            "user_id": user_id,
            "is_new_user": True,
            "interests": None,
            "feed": feed
        }

    # --- existing user ---
    interests = USER_INTERESTS[user_id]

    if user_id not in SEEN_REELS:
        SEEN_REELS[user_id] = set()

    # get interest matched reels
    if interests:
        matched_reels = [r for r, data in REELS.items() if data["category"] in interests]
    else:
        matched_reels = all_reel_ids

    # unseen interest matched reels
    unseen_matched = [r for r in matched_reels if r not in SEEN_REELS[user_id]]

    feed_ids = []
    is_randomized = False

    # fill from interest matched first
    random.shuffle(unseen_matched)
    feed_ids.extend(unseen_matched[:count])

    # if not enough, top up from random unseen
    if len(feed_ids) < count:
        is_randomized = True
        unseen_random = [
            r for r in all_reel_ids
            if r not in SEEN_REELS[user_id] and r not in feed_ids
        ]
        random.shuffle(unseen_random)
        feed_ids.extend(unseen_random[:count - len(feed_ids)])

    # if still not enough, reset seen and fill rest
    if len(feed_ids) < count:
        SEEN_REELS[user_id] = set()
        is_randomized = True
        remaining = [r for r in all_reel_ids if r not in feed_ids]
        random.shuffle(remaining)
        feed_ids.extend(remaining[:count - len(feed_ids)])

    # mark as seen
    SEEN_REELS[user_id].update(feed_ids)

    feed = [build_reel_object(r, user_id) for r in feed_ids]

    return {
        "user_id": user_id,
        "is_new_user": False,
        "is_randomized": is_randomized,
        "interests": interests,
        "feed": feed
    }