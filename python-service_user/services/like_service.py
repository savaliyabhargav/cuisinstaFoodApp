from mock_data import REELS, USER_LIKES, USER_CATEGORY_LIKES, USER_INTERESTS

def toggle_like(user_id: str, reel_id: str):
    # init user data if not present
    if user_id not in USER_LIKES:
        USER_LIKES[user_id] = set()
    if user_id not in USER_CATEGORY_LIKES:
        USER_CATEGORY_LIKES[user_id] = {}

    category = REELS[reel_id]["category"]
    already_liked = reel_id in USER_LIKES[user_id]

    if already_liked:
        # unlike
        USER_LIKES[user_id].remove(reel_id)
        REELS[reel_id]["like_count"] -= 1
        # decrease category like count
        USER_CATEGORY_LIKES[user_id][category] = max(
            0, USER_CATEGORY_LIKES[user_id].get(category, 0) - 1
        )
        action = "unliked"
    else:
        # like
        USER_LIKES[user_id].add(reel_id)
        REELS[reel_id]["like_count"] += 1
        # increase category like count
        USER_CATEGORY_LIKES[user_id][category] = (
            USER_CATEGORY_LIKES[user_id].get(category, 0) + 1
        )
        action = "liked"

    # recalculate user top 5 interests based on likes
    category_counts = USER_CATEGORY_LIKES[user_id]
    if category_counts:
        top5 = sorted(category_counts, key=category_counts.get, reverse=True)[:5]
        USER_INTERESTS[user_id] = top5
    else:
        USER_INTERESTS[user_id] = None

    return {
        "action": action,
        "reel_id": reel_id,
        "new_like_count": REELS[reel_id]["like_count"],
        "updated_interests": USER_INTERESTS[user_id]
    }