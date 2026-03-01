from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.feed import router as feed_router
from routes.likes import router as likes_router
import uvicorn

app = FastAPI(title="Food Reels API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feed_router)
app.include_router(likes_router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Food Reels API is running"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5002, reload=False)