from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
import json
import sqlite3
import aiosqlite
import hashlib
import time
import os
import logging
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

app = FastAPI(title="Aura Garden Backend")

# --- CORS ---
# Локальная разработка + доп. origin из Render / Vercel (через запятую в CORS_ORIGINS)
_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://aura-tech-five.vercel.app",
]
origins = list(_default_origins)
# Render / .env: без кавычек в значении; если вставили "https://..." — снимем обрамление
for _o in os.environ.get("CORS_ORIGINS", "").split(","):
    logger.info(f"CORS_ORIGINS: {_o}")
    _o = _o.strip().strip('"').strip("'").rstrip("/")
    if _o and _o not in origins:
        origins.append(_o)

# Regex: локальные хосты + любой поддомен *.onrender.com (HTTPS), чтобы фронт на Render проходил CORS без ручного CORS_ORIGINS
_cors_local = r"https?://(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?"
_cors_render = r"https://[a-z0-9][a-z0-9.-]*\.onrender\.com"
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=rf"{_cors_local}|{_cors_render}$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Initialization ---
DB_PATH = "aura.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as conn:
        # Users Table
        await conn.execute('''CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT,
            email TEXT,
            display_name TEXT,
            avatar TEXT
        )''')
        
        # User dynamic data (Garden, Wallet, Moods, etc)
        await conn.execute('''CREATE TABLE IF NOT EXISTS user_data (
            username TEXT PRIMARY KEY,
            garden_json TEXT,
            wallet_json TEXT,
            moods_json TEXT,
            notifications_json TEXT
        )''')
        
        # Tasks Table
        await conn.execute('''CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            title TEXT,
            category TEXT,
            status TEXT,
            stake INTEGER,
            created_at TEXT,
            completed_at TEXT,
            failed_at TEXT,
            proof_photo TEXT,
            review_votes TEXT
        )''')
        
        # Fears Table
        await conn.execute('''CREATE TABLE IF NOT EXISTS fears (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            text TEXT,
            challenge TEXT,
            status TEXT,
            created_at TEXT,
            conquered_at TEXT
        )''')
        
        # Default demo user
        demo_user = "demo@aura.app"
        demo_pass = hashlib.sha256("demo123".encode()).hexdigest()
        await conn.execute("INSERT OR IGNORE INTO users (username, password, email, display_name) VALUES (?, ?, ?, ?)",
                    (demo_user, demo_pass, demo_user, "Alex Green"))
        
        await conn.commit()

@app.on_event("startup")
async def startup_event():
    await init_db()

# --- Auth ---
class AuthUser(BaseModel):
    username: str
    password: str
    email: Optional[str] = None
    display_name: Optional[str] = None

def hash_pw(pw: str):
    return hashlib.sha256(pw.encode()).hexdigest()

@app.post("/api/register")
async def register(user: AuthUser):
    hashed = hash_pw(user.password)
    try:
        async with aiosqlite.connect(DB_PATH) as conn:
            # Check existance
            async with conn.execute("SELECT 1 FROM users WHERE username = ? OR email = ?", (user.username, user.email)) as cursor:
                if await cursor.fetchone():
                    raise HTTPException(status_code=400, detail="User already exists")
            
            await conn.execute(
                "INSERT INTO users (username, password, email, display_name) VALUES (?, ?, ?, ?)",
                (user.username, hashed, user.email, user.display_name or user.username)
            )
            await conn.commit()
            
        return {
            "success": True, 
            "user": {
                "uid": user.username,
                "username": user.username,
                "email": user.email,
                "displayName": user.display_name or user.username
            }
        }
    except HTTPException: raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
async def login(user: AuthUser):
    hashed = hash_pw(user.password)
    async with aiosqlite.connect(DB_PATH) as conn:
        async with conn.execute(
            "SELECT username, email, display_name FROM users WHERE (username = ? OR email = ?) AND password = ?",
            (user.username, user.username, hashed)
        ) as cursor:
            row = await cursor.fetchone()
    
    if row:
        return {
            "success": True,
            "user": {
                "uid": row[0],
                "username": row[0],
                "email": row[1],
                "displayName": row[2]
            }
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

# --- User Data & Sync ---
@app.get("/api/user/data/{username}")
async def get_user_data(username: str):
    async with aiosqlite.connect(DB_PATH) as conn:
        async with conn.execute("SELECT garden_json, wallet_json, moods_json, notifications_json FROM user_data WHERE username = ?", (username,)) as cursor:
            row = await cursor.fetchone()
    if row:
        return {
            "garden": json.loads(row[0]),
            "wallet": json.loads(row[1]),
            "moods": json.loads(row[2]),
            "notifications": json.loads(row[3])
        }
    return {"garden": None, "wallet": None, "moods": [], "notifications": []}

@app.post("/api/user/data")
async def save_user_data(username: str, payload: dict):
    garden = json.dumps(payload.get("garden", {}))
    wallet = json.dumps(payload.get("wallet", {}))
    moods = json.dumps(payload.get("moods", []))
    notifications = json.dumps(payload.get("notifications", []))
    
    async with aiosqlite.connect(DB_PATH) as conn:
        await conn.execute("""
            INSERT INTO user_data (username, garden_json, wallet_json, moods_json, notifications_json)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(username) DO UPDATE SET
            garden_json=excluded.garden_json,
            wallet_json=excluded.wallet_json,
            moods_json=excluded.moods_json,
            notifications_json=excluded.notifications_json
        """, (username, garden, wallet, moods, notifications))
        await conn.commit()
    return {"success": True}

# --- Tasks & Fears ---
class TaskData(BaseModel):
    id: str
    user_id: str
    title: str
    category: str
    status: str
    stake: int
    createdAt: str
    completedAt: Optional[str] = None
    failedAt: Optional[str] = None
    proofPhoto: Optional[str] = None
    reviewVotes: Optional[dict] = None

class FearData(BaseModel):
    id: str
    user_id: str
    text: str
    challenge: str
    status: str
    createdAt: str
    conqueredAt: Optional[str] = None

@app.get("/api/tasks/{username}")
async def get_tasks(username: str):
    async with aiosqlite.connect(DB_PATH) as conn:
        async with conn.execute("SELECT * FROM tasks WHERE user_id = ?", (username,)) as cursor:
            rows = await cursor.fetchall()
    return {"tasks": [{
        "id": r[0], "user_id": r[1], "title": r[2], "category": r[3], "status": r[4],
        "stake": r[5], "createdAt": r[6], "completedAt": r[7], "failedAt": r[8],
        "proofPhoto": r[9], "reviewVotes": json.loads(r[10]) if r[10] else {"valid": 0, "invalid": 0}
    } for r in rows]}

@app.post("/api/tasks")
async def update_task(task: TaskData):
    async with aiosqlite.connect(DB_PATH) as conn:
        await conn.execute("""
            INSERT INTO tasks (id, user_id, title, category, status, stake, created_at, completed_at, failed_at, proof_photo, review_votes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET 
            status=excluded.status, stake=excluded.stake, completed_at=excluded.completed_at,
            failed_at=excluded.failed_at, proof_photo=excluded.proof_photo, review_votes=excluded.review_votes
        """, (task.id, task.user_id, task.title, task.category, task.status, task.stake, 
              task.createdAt, task.completedAt, task.failedAt, task.proofPhoto, json.dumps(task.reviewVotes or {})))
        await conn.commit()
    return {"success": True}

@app.get("/api/fears/{username}")
async def get_fears(username: str):
    async with aiosqlite.connect(DB_PATH) as conn:
        async with conn.execute("SELECT * FROM fears WHERE user_id = ?", (username,)) as cursor:
            rows = await cursor.fetchall()
    return {"fears": [{
        "id": r[0], "user_id": r[1], "text": r[2], "challenge": r[3], "status": r[4], 
        "createdAt": r[5], "conqueredAt": r[6]
    } for r in rows]}

@app.post("/api/fears")
async def update_fear(fear: FearData):
    async with aiosqlite.connect(DB_PATH) as conn:
        await conn.execute("""
            INSERT INTO fears (id, user_id, text, challenge, status, created_at, conquered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET status=excluded.status, conquered_at=excluded.conquered_at
        """, (fear.id, fear.user_id, fear.text, fear.challenge, fear.status, fear.createdAt, fear.conqueredAt))
        await conn.commit()
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
