# 🍔 Food Reels API v2.0

A Python (FastAPI) backend that serves a personalized food reels feed based on user interests.
Interests are automatically learned from **likes** and **watch time**.

> ⚠️ This is an updated version of the previous API. The endpoints are the same but the backend now uses **MongoDB Atlas** instead of mock data. All behavior is real and persistent.

---

## 🚀 Base URL

```
http://localhost:5002
```

---

## 📡 Endpoints

---

### 1. Health Check

**`GET /`**

**Response:**
```json
{
    "status": "ok",
    "message": "Food Reels API is running",
    "database": "MongoDB Atlas"
}
```

---

### 2. Get Reels Feed

**`GET /feed/{user_id}`**

Returns a personalized list of reels for the given user.

**URL Params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | ✅ Yes | The ID of the user requesting the feed |

**Query Params:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `count` | integer | ❌ No | `10` | Number of reels to return |

---

#### Case 1 — New User

If the user does not exist, the API will automatically create them and return 20 random reels.

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
            "category": "seafood",
            "like_count": 210,
            "did_i_like": false,
            "restaurant": {
                "restaurant_id": "rest_012",
                "name": "Seafood Spot",
                "profile_image": "https://example.com/rest_012.jpg"
            }
        }
    ]
}
```

---

#### Case 2 — Existing User

Returns reels matching the user's top 5 interests. Already seen reels are filtered out.

**Request:**
```
GET http://localhost:5002/feed/user_001
GET http://localhost:5002/feed/user_001?count=5
```

**Response:**
```json
{
    "user_id": "user_001",
    "is_new_user": false,
    "is_randomized": false,
    "interests": ["pizza", "pasta", "burgers", "sushi", "tacos"],
    "feed": [...]
}
```

---

#### Case 3 — User Has Seen All Interest-Matched Reels

Random reels are mixed in and `is_randomized` will be `true`.

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

#### Feed Response Fields

| Field | Description |
|-------|-------------|
| `user_id` | The requesting user |
| `is_new_user` | `true` if user was just created |
| `is_randomized` | `true` if random reels were mixed in |
| `interests` | User's current top 5 food interests (null if no likes yet) |
| `feed` | Array of reel objects |
| `feed[].reel_id` | ID of the reel |
| `feed[].category` | Food category of the reel |
| `feed[].like_count` | Total number of likes on this reel |
| `feed[].did_i_like` | `true` if the requesting user has liked this reel |
| `feed[].restaurant` | Restaurant info |

---

### 3. Like / Unlike a Reel

**`POST /like`**

Toggles like status. Calling it once likes, calling it again unlikes.
Also automatically recalculates the user's top 5 interests after every action.

> ⚠️ User must exist before liking. Call `/feed/{user_id}` at least once first.

**Request Body:**
```json
{
    "user_id": "user_001",
    "reel_id": "reel_001"
}
```

**Like Response:**
```json
{
    "action": "liked",
    "reel_id": "reel_001",
    "new_like_count": 121,
    "updated_interests": ["pizza", "pasta", "burgers", "sushi", "tacos"]
}
```

**Unlike Response:**
```json
{
    "action": "unliked",
    "reel_id": "reel_001",
    "new_like_count": 120,
    "updated_interests": ["pasta", "burgers", "sushi", "tacos"]
}
```

---

### 4. 🆕 Record Watch Time

**`POST /watch-time`**

Records how many seconds a user watched reels in a specific category.
This is used to improve interest recommendations — the more time a user spends on a category, the higher it ranks in their interests.

> ⚠️ Call this when the user scrolls past or finishes watching a reel.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | ✅ Yes | The user who watched |
| `category` | string | ✅ Yes | The food category of the reel watched |
| `seconds_watched` | float | ✅ Yes | How many seconds they watched |

**Request:**
```json
{
    "user_id": "user_001",
    "category": "ramen",
    "seconds_watched": 45.5
}
```

**Response:**
```json
{
    "user_id": "user_001",
    "category": "ramen",
    "seconds_watched": 45.5,
    "updated_interests": ["ramen", "pizza", "pasta", "burgers", "sushi"]
}
```

---

## 🧠 How Interest Learning Works

Interests are automatically calculated from two signals:

| Signal | Weight |
|--------|--------|
| 1 Like on a category | +10 points |
| 1 Second watched in a category | +1 point |

After every like, unlike, or watch time update — the user's **top 5 scoring categories** become their interests. The next feed call will serve reels based on those updated interests.

---

## ❌ Error Responses

| Status Code | When it happens |
|-------------|-----------------|
| `404` | Reel ID not found |
| `404` | User not found (call `/feed` first) |

**Example:**
```json
{
    "detail": "Reel 'reel_999' not found"
}
```

---

## 📁 Project Structure

```
food-reels-api/
├── app.py
├── requirements.txt
├── Dockerfile
├── .env
├── db/
│   ├── database.py
│   └── seed.py
└── routes/
    ├── feed.py
    ├── likes.py
    └── watch_time.py
```

---

## 🛠 Tech Stack

- **Python 3.11**
- **FastAPI**
- **Uvicorn**
- **PyMongo** — MongoDB driver
- **MongoDB Atlas** — cloud database
- **Docker**