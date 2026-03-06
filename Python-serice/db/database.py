from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "food_reels")

client: MongoClient = None
db = None

def connect_db():
    global client, db
    client = MongoClient(MONGODB_URI, tls=True, tlsAllowInvalidCertificates=True)
    db = client[DB_NAME]
    client.admin.command("ping")
    print(f"✅ Connected to MongoDB Atlas — database: '{DB_NAME}'")

def close_db():
    global client
    if client:
        client.close()
        print("🔌 MongoDB connection closed")

def get_db():
    return db