"""
API для пользователей чата: регистрация, вход, профиль, загрузка аватара.
Действия: register, login, me, update_profile, upload_avatar, send_chat, get_chat.
"""
import json
import os
import hashlib
import secrets
import base64
import pg8000.native as pg8000
import boto3
from urllib.parse import urlparse

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p62247026_streamer_site_1")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    url = urlparse(os.environ["DATABASE_URL"])
    return pg8000.Connection(
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port or 5432,
        database=url.path.lstrip("/"),
    )


def resp(status, body):
    return {
        "statusCode": status,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_user_by_token(conn, token: str):
    if not token:
        return None
    rows = conn.run(
        f"SELECT id, username, color, location, avatar_url, created_at FROM {SCHEMA}.users WHERE session_token=:t",
        t=token,
    )
    if not rows:
        return None
    r = rows[0]
    return {"id": r[0], "username": r[1], "color": r[2], "location": r[3], "avatar_url": r[4], "created_at": r[5]}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action", "")
    headers = event.get("headers") or {}
    token = headers.get("x-session-token", "") or headers.get("X-Session-Token", "")

    conn = get_conn()

    # --- REGISTER ---
    if action == "register":
        username = body.get("username", "").strip()
        password = body.get("password", "")

        if not username or not password:
            return resp(400, {"ok": False, "error": "Введи никнейм и пароль"})
        if len(username) < 3:
            return resp(400, {"ok": False, "error": "Никнейм минимум 3 символа"})
        if len(password) < 4:
            return resp(400, {"ok": False, "error": "Пароль минимум 4 символа"})

        existing = conn.run(f"SELECT id FROM {SCHEMA}.users WHERE username=:u", u=username)
        if existing:
            return resp(400, {"ok": False, "error": "Никнейм уже занят"})

        pw_hash = hash_password(password)
        session = secrets.token_hex(32)
        conn.run(
            f"INSERT INTO {SCHEMA}.users (username, password_hash, session_token) VALUES (:u,:p,:s)",
            u=username, p=pw_hash, s=session,
        )
        rows = conn.run(f"SELECT id, username, color, location, avatar_url, created_at FROM {SCHEMA}.users WHERE session_token=:s", s=session)
        r = rows[0]
        user = {"id": r[0], "username": r[1], "color": r[2], "location": r[3], "avatar_url": r[4], "created_at": r[5]}
        return resp(200, {"ok": True, "token": session, "user": user})

    # --- LOGIN ---
    if action == "login":
        username = body.get("username", "").strip()
        password = body.get("password", "")
        pw_hash = hash_password(password)

        rows = conn.run(
            f"SELECT id FROM {SCHEMA}.users WHERE username=:u AND password_hash=:p",
            u=username, p=pw_hash,
        )
        if not rows:
            return resp(401, {"ok": False, "error": "Неверный никнейм или пароль"})

        user_id = rows[0][0]
        session = secrets.token_hex(32)
        conn.run(f"UPDATE {SCHEMA}.users SET session_token=:s WHERE id=:id", s=session, id=user_id)
        rows2 = conn.run(f"SELECT id, username, color, location, avatar_url, created_at FROM {SCHEMA}.users WHERE id=:id", id=user_id)
        r = rows2[0]
        user = {"id": r[0], "username": r[1], "color": r[2], "location": r[3], "avatar_url": r[4], "created_at": r[5]}
        return resp(200, {"ok": True, "token": session, "user": user})

    # --- ME (получить профиль по токену) ---
    if action == "me":
        user = get_user_by_token(conn, token)
        if not user:
            return resp(401, {"ok": False, "error": "Не авторизован"})
        return resp(200, {"ok": True, "user": user})

    # --- UPDATE PROFILE ---
    if action == "update_profile":
        user = get_user_by_token(conn, token)
        if not user:
            return resp(401, {"ok": False, "error": "Не авторизован"})
        color = body.get("color", user["color"])
        location = body.get("location", user["location"])
        conn.run(
            f"UPDATE {SCHEMA}.users SET color=:c, location=:l WHERE id=:id",
            c=color, l=location, id=user["id"],
        )
        return resp(200, {"ok": True})

    # --- UPLOAD AVATAR ---
    if action == "upload_avatar":
        user = get_user_by_token(conn, token)
        if not user:
            return resp(401, {"ok": False, "error": "Не авторизован"})

        image_b64 = body.get("image_b64", "")
        ext = body.get("ext", "jpg")
        if not image_b64:
            return resp(400, {"ok": False, "error": "Нет данных изображения"})

        image_data = base64.b64decode(image_b64)
        key = f"avatars/user_{user['id']}.{ext}"
        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=key, Body=image_data, ContentType=f"image/{ext}")
        avatar_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"
        conn.run(f"UPDATE {SCHEMA}.users SET avatar_url=:url WHERE id=:id", url=avatar_url, id=user["id"])
        return resp(200, {"ok": True, "avatar_url": avatar_url})

    # --- SEND CHAT ---
    if action == "send_chat":
        user = get_user_by_token(conn, token)
        if not user:
            return resp(401, {"ok": False, "error": "Войди, чтобы писать в чат"})
        text = body.get("text", "").strip()
        if not text:
            return resp(400, {"ok": False, "error": "Пустое сообщение"})
        conn.run(
            f"INSERT INTO {SCHEMA}.chat_messages (username, color, message, user_id) VALUES (:u,:c,:m,:uid)",
            u=user["username"], c=user["color"], m=text, uid=user["id"],
        )
        return resp(200, {"ok": True})

    # --- GET CHAT ---
    if action == "get_chat":
        rows = conn.run(
            f"SELECT id, username, color, message, is_hidden, created_at FROM {SCHEMA}.chat_messages WHERE is_hidden=FALSE ORDER BY created_at DESC LIMIT 80"
        )
        chat = [{"id": r[0], "user": r[1], "color": r[2], "text": r[3], "is_hidden": r[4], "created_at": str(r[5])} for r in rows]
        chat.reverse()
        return resp(200, {"ok": True, "chat": chat})

    return resp(400, {"ok": False, "error": "Неизвестное действие"})
