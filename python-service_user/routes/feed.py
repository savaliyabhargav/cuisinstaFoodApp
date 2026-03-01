from fastapi import APIRouter
from services.feed_service import get_feed

router = APIRouter()

@router.get("/feed/{user_id}")
def feed_endpoint(user_id: str, count: int = 10):
    return get_feed(user_id, count)