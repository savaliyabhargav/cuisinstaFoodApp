from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

from db.database import connect_db, close_db
from routes.feed import router as feed_router
from routes.likes import router as likes_router
from routes.watch_time import router as watch_time_router

load_dotenv()

app = FastAPI(
    title="Food Reels API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    connect_db()

@app.on_event("shutdown")
def shutdown():
    close_db()

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": "Food Reels API is running",
        "database": "MongoDB Atlas"
    }

app.include_router(feed_router)
app.include_router(likes_router)
app.include_router(watch_time_router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)