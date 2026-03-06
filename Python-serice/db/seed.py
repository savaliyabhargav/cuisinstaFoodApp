from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "food_reels")

RESTAURANTS = [
    {"restaurant_id": "rest_001", "name": "Pizza Palace",   "profile_image": "https://example.com/rest_001.jpg"},
    {"restaurant_id": "rest_002", "name": "Pasta Paradise", "profile_image": "https://example.com/rest_002.jpg"},
    {"restaurant_id": "rest_003", "name": "Burger Barn",    "profile_image": "https://example.com/rest_003.jpg"},
    {"restaurant_id": "rest_004", "name": "Sushi Station",  "profile_image": "https://example.com/rest_004.jpg"},
    {"restaurant_id": "rest_005", "name": "Taco Town",      "profile_image": "https://example.com/rest_005.jpg"},
    {"restaurant_id": "rest_006", "name": "Ramen Republic", "profile_image": "https://example.com/rest_006.jpg"},
    {"restaurant_id": "rest_007", "name": "BBQ Bliss",      "profile_image": "https://example.com/rest_007.jpg"},
    {"restaurant_id": "rest_008", "name": "Curry Corner",   "profile_image": "https://example.com/rest_008.jpg"},
    {"restaurant_id": "rest_009", "name": "Salad Spot",     "profile_image": "https://example.com/rest_009.jpg"},
    {"restaurant_id": "rest_010", "name": "Dessert Den",    "profile_image": "https://example.com/rest_010.jpg"},
    {"restaurant_id": "rest_011", "name": "Sandwich Shack", "profile_image": "https://example.com/rest_011.jpg"},
    {"restaurant_id": "rest_012", "name": "Seafood Spot",   "profile_image": "https://example.com/rest_012.jpg"},
]

REELS = [
    {"reel_id": "reel_001", "category": "pizza",    "like_count": 120, "restaurant_id": "rest_001"},
    {"reel_id": "reel_002", "category": "pizza",    "like_count": 95,  "restaurant_id": "rest_001"},
    {"reel_id": "reel_003", "category": "pasta",    "like_count": 200, "restaurant_id": "rest_002"},
    {"reel_id": "reel_004", "category": "pasta",    "like_count": 88,  "restaurant_id": "rest_002"},
    {"reel_id": "reel_005", "category": "burgers",  "like_count": 310, "restaurant_id": "rest_003"},
    {"reel_id": "reel_006", "category": "burgers",  "like_count": 150, "restaurant_id": "rest_003"},
    {"reel_id": "reel_007", "category": "sushi",    "like_count": 420, "restaurant_id": "rest_004"},
    {"reel_id": "reel_008", "category": "sushi",    "like_count": 190, "restaurant_id": "rest_004"},
    {"reel_id": "reel_009", "category": "tacos",    "like_count": 75,  "restaurant_id": "rest_005"},
    {"reel_id": "reel_010", "category": "tacos",    "like_count": 60,  "restaurant_id": "rest_005"},
    {"reel_id": "reel_011", "category": "ramen",    "like_count": 270, "restaurant_id": "rest_006"},
    {"reel_id": "reel_012", "category": "ramen",    "like_count": 130, "restaurant_id": "rest_006"},
    {"reel_id": "reel_013", "category": "bbq",      "like_count": 180, "restaurant_id": "rest_007"},
    {"reel_id": "reel_014", "category": "bbq",      "like_count": 90,  "restaurant_id": "rest_007"},
    {"reel_id": "reel_015", "category": "curry",    "like_count": 145, "restaurant_id": "rest_008"},
    {"reel_id": "reel_016", "category": "curry",    "like_count": 70,  "restaurant_id": "rest_008"},
    {"reel_id": "reel_017", "category": "salad",    "like_count": 55,  "restaurant_id": "rest_009"},
    {"reel_id": "reel_018", "category": "salad",    "like_count": 40,  "restaurant_id": "rest_009"},
    {"reel_id": "reel_019", "category": "dessert",  "like_count": 500, "restaurant_id": "rest_010"},
    {"reel_id": "reel_020", "category": "dessert",  "like_count": 380, "restaurant_id": "rest_010"},
    {"reel_id": "reel_021", "category": "sandwich", "like_count": 65,  "restaurant_id": "rest_011"},
    {"reel_id": "reel_022", "category": "sandwich", "like_count": 48,  "restaurant_id": "rest_011"},
    {"reel_id": "reel_023", "category": "seafood",  "like_count": 210, "restaurant_id": "rest_012"},
    {"reel_id": "reel_024", "category": "seafood",  "like_count": 175, "restaurant_id": "rest_012"},
    {"reel_id": "reel_025", "category": "pizza",    "like_count": 110, "restaurant_id": "rest_001"},
    {"reel_id": "reel_026", "category": "burgers",  "like_count": 220, "restaurant_id": "rest_003"},
    {"reel_id": "reel_027", "category": "sushi",    "like_count": 305, "restaurant_id": "rest_004"},
    {"reel_id": "reel_028", "category": "ramen",    "like_count": 160, "restaurant_id": "rest_006"},
    {"reel_id": "reel_029", "category": "tacos",    "like_count": 85,  "restaurant_id": "rest_005"},
    {"reel_id": "reel_030", "category": "curry",    "like_count": 95,  "restaurant_id": "rest_008"},
]

USERS = [
    {
        "user_id": "user_001",
        "interests": ["pizza", "pasta", "burgers", "sushi", "tacos"],
        "liked_reels": ["reel_001", "reel_003", "reel_005", "reel_007", "reel_009"],
        "seen_reels": ["reel_001", "reel_002", "reel_003", "reel_004", "reel_005"],
        "category_likes": {"pizza": 2, "pasta": 2, "burgers": 2, "sushi": 2, "tacos": 1},
        "category_watch_time": {}
    },
    {
        "user_id": "user_002",
        "interests": ["ramen", "sushi", "seafood"],
        "liked_reels": ["reel_007", "reel_011", "reel_023"],
        "seen_reels": ["reel_007", "reel_008", "reel_011", "reel_012", "reel_023"],
        "category_likes": {"ramen": 1, "sushi": 1, "seafood": 1},
        "category_watch_time": {}
    },
    {
        "user_id": "user_003",
        "interests": ["dessert", "bbq"],
        "liked_reels": ["reel_019", "reel_013"],
        "seen_reels": ["reel_013", "reel_014", "reel_019", "reel_020"],
        "category_likes": {"dessert": 1, "bbq": 1},
        "category_watch_time": {}
    },
]

def seed():
    client = MongoClient(MONGODB_URI, tls=True, tlsAllowInvalidCertificates=True)
    db = client[DB_NAME]

    print(f"🌱 Seeding database: '{DB_NAME}'...")

    db.restaurants.drop()
    db.reels.drop()
    db.users.drop()
    print("🗑️  Dropped existing collections")

    db.restaurants.insert_many(RESTAURANTS)
    print(f"✅ Inserted {len(RESTAURANTS)} restaurants")

    db.reels.insert_many(REELS)
    print(f"✅ Inserted {len(REELS)} reels")

    db.users.insert_many(USERS)
    print(f"✅ Inserted {len(USERS)} users")

    db.restaurants.create_index([("restaurant_id", ASCENDING)], unique=True)
    db.reels.create_index([("reel_id", ASCENDING)], unique=True)
    db.reels.create_index([("category", ASCENDING)])
    db.users.create_index([("user_id", ASCENDING)], unique=True)
    print("✅ Created indexes")

    client.close()
    print("\n🎉 Seeding complete!")

if __name__ == "__main__":
    seed()