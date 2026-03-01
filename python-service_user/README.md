Hit these in your browser or Postman:
1. New user test — use any ID that doesn't exist in mock data:
http://localhost:5002/feed/user_999
You should see "is_new_user": true and 20 random reels.
2. Hit the same user again — now they exist:
http://localhost:5002/feed/user_999
Now you should see "is_new_user": false and different reels (unseen ones).
3. Existing user from mock data:
http://localhost:5002/feed/user_001
Should return reels matching their interests — pizza, pasta, burgers, sushi, tacos.
4. Test the count param:
http://localhost:5002/feed/user_001?count=5
If you want to also visually test everything nicely, just go to:
http://localhost:5002/docs
FastAPI's Swagger UI lets you test all endpoints with a nice interface without needing Postman.
Let me know what responses you're getting!


# 🍔 Food Reels API

A Python (FastAPI) backend that serves a personalized food reels feed to users based on their interests, with like/unlike functionality and automatic interest learning.

---

## 🚀 Running the Server

### Using Docker
```bash
docker build -t food-reels-api .
docker run -p 5002:5002 food-reels-api
```

Server will be live at: `http://localhost:5002`

Auto-generated Swagger docs at: `http://localhost:5002/docs`

---

## 📡 Endpoints

### 1. Health Check

**`GET /`**

Check if the server is running.

**Request:**
```
GET http://localhost:5002/
```

**Response:**
```json
{
    "status": "ok",
    "message": "Food Reels API is running"
}
```

---

### 2. Get Reels Feed

**`GET /feed/{user_id}`**

Returns a personalized list of reels for the given user. Each reel includes full details — like count, restaurant info, and whether the current user has liked it.

**URL Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | ✅ Yes | The ID of the user requesting the feed |

**Query Params:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `count` | integer | ❌ No | `10` | Number of reels to return |

---

#### Case 1 — New User (never seen before)

If the `user_id` does not exist in the system, the API will:
- Automatically create the user
- Set their interests to `null` (no preferences yet)
- Return **20 random reels** regardless of `count`

**Request:**
```
GET http://localhost:5002/feed/user_999
```

**Response:**
```json
{
    "user_id": "user_999",
    "is_new_user": true,
    "interests": null,
    "feed": [
        {
            "reel_id": "reel_023",
            "category": "ramen",
            "like_count": 270,
            "did_i_like": false,
            "restaurant": {
                "restaurant_id": "rest_011",
                "name": "Ramen Republic",
                "profile_image": "https://example.com/rest_011.jpg"
            }
        },
        ...
    ]
}
```

---

#### Case 2 — Existing User (with interests)

Returns reels matching the user's top 5 interests. Already seen reels are filtered out so the feed always feels fresh.

**Request:**
```
GET http://localhost:5002/feed/user_001
```

**Request with custom count:**
```
GET http://localhost:5002/feed/user_001?count=5
```

**Response:**
```json
{
    "user_id": "user_001",
    "is_new_user": false,
    "is_randomized": false,
    "interests": ["pizza", "pasta", "burgers", "sushi", "tacos"],
    "feed": [
        {
            "reel_id": "reel_001",
            "category": "pizza",
            "like_count": 120,
            "did_i_like": false,
            "restaurant": {
                "restaurant_id": "rest_001",
                "name": "Pizza Palace",
                "profile_image": "https://example.com/rest_001.jpg"
            }
        },
        ...
    ]
}
```

---

#### Case 3 — User has seen all interest-matched reels

When the user has seen all reels matching their interests, the API automatically fills the remaining slots with random reels from the full pool. The response will include `"is_randomized": true` so the frontend knows.

**Response (partial):**
```json
{
    "user_id": "user_001",
    "is_new_user": false,
    "is_randomized": true,
    "interests": ["pizza", "pasta", "burgers", "sushi", "tacos"],
    "feed": [...]
}
```

---

#### Feed Response Fields Explained

| Field | Description |
|-------|-------------|
| `user_id` | The requesting user |
| `is_new_user` | `true` if user was just created |
| `is_randomized` | `true` if random reels were mixed in (not present for new users) |
| `interests` | User's current top 5 food interests (null if no likes yet) |
| `feed` | Array of reel objects |
| `feed[].reel_id` | ID of the reel — use this to fetch the actual video from the cloud |
| `feed[].category` | Food category this reel belongs to |
| `feed[].like_count` | Total number of likes on this reel |
| `feed[].did_i_like` | `true` if the requesting user has liked this reel |
| `feed[].restaurant` | Info about the restaurant that uploaded the reel |

---

### 3. Like / Unlike a Reel

**`POST /like`**

Toggles the like status of a reel for a user. If the user hasn't liked the reel, it will **like** it. If they already liked it, it will **unlike** it.

Every like/unlike also automatically recalculates the user's top 5 food interests based on the categories they've liked most.

> ⚠️ The user must exist in the system before liking. Call `/feed/{user_id}` at least once first to register the user.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "user_id": "user_001",
    "reel_id": "reel_001"
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | ✅ Yes | The user who is liking/unliking |
| `reel_id` | string | ✅ Yes | The reel being liked/unliked |

---

**Like Response:**
```json
{
    "action": "liked",
    "reel_id": "reel_001",
    "new_like_count": 121,
    "updated_interests": ["pizza", "pasta", "burgers", "sushi", "tacos"]
}
```

**Unlike Response (same body, called again):**
```json
{
    "action": "unliked",
    "reel_id": "reel_001",
    "new_like_count": 120,
    "updated_interests": ["pasta", "burgers", "sushi", "tacos"]
}
```

**Like Response Fields Explained:**

| Field | Description |
|-------|-------------|
| `action` | Either `"liked"` or `"unliked"` |
| `reel_id` | The reel that was affected |
| `new_like_count` | Updated total like count of the reel |
| `updated_interests` | User's recalculated top 5 interests after this action |

---

## ❌ Error Responses

| Status Code | When it happens |
|-------------|-----------------|
| `404` | Reel ID not found when liking |
| `404` | User not found when liking (call `/feed` first) |

**Example error response:**
```json
{
    "detail": "Reel 'reel_999' not found"
}
```

---

## 🧠 How Interest Learning Works

User interests are not manually set — they are **automatically learned from likes:**

1. Every time a user likes a reel, the category of that reel is recorded
2. Every time a user unlikes a reel, the category count is decreased
3. After every like/unlike, the user's **top 5 most liked categories** become their interests
4. The next feed call will then serve reels matching those updated interests

This means the feed gets smarter the more the user interacts with it.

---

## 📁 Project Structure

```
project/
├── app.py                  → Server entry point
├── mock_data.py            → All mock data (users, reels, restaurants)
├── requirements.txt        → Python dependencies
├── Dockerfile              → Docker config
├── routes/
│   ├── feed.py             → Feed endpoint
│   └── likes.py            → Like/Unlike endpoint
└── services/
    ├── feed_service.py     → Feed building logic
    └── like_service.py     → Like logic + interest recalculation
```

---

## 🛠 Tech Stack

- **Python 3.11**
- **FastAPI** — API framework
- **Uvicorn** — ASGI server
- **Pydantic** — request body validation
- **Docker** — containerization







docker build -t food-reels-api .
docker run -p 5002:5002 food-reels-api