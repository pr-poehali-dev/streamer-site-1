"""
Панель управления стримера — API для /admin.
Методы: login, get_data, toggle_stream, update_stream,
        update_schedule, delete_schedule, mark_donate_read,
        hide_chat_message, send_chat_message, regenerate_key.
Stream key: 25 символов, автоматически меняется каждые 2 дня.
"""
import json
import os
import secrets
import string
from datetime import datetime, timedelta, timezone
import pg8000.native as pg8000
from urllib.parse import urlparse

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p62247026_streamer_site_1")
KEY_LENGTH = 25
KEY_TTL_DAYS = 2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
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
        "headers": {**CORS_HEADERS, "Content-Type": "application/json"},
        "body": json.dumps(body, ensure_ascii=False, default=str),
    }


def check_token(headers):
    token = headers.get("x-admin-token", "") or headers.get("X-Admin-Token", "")
    return token == os.environ.get("ADMIN_PASSWORD", "")


def gen_stream_key():
    alphabet = string.ascii_letters + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(KEY_LENGTH))


def maybe_rotate_key(conn):
    """Если ключ просрочен — генерируем новый, возвращаем актуальный ключ и expires_at."""
    rows = conn.run(f"SELECT stream_key, key_expires_at FROM {SCHEMA}.stream_status LIMIT 1")
    if not rows:
        return "", None
    current_key, expires_at = rows[0]

    now = datetime.now(timezone.utc)
    # expires_at из БД может быть без tzinfo
    if expires_at and expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    need_rotate = (not current_key) or (expires_at is None) or (now >= expires_at)

    if need_rotate:
        new_key = gen_stream_key()
        new_expires = now + timedelta(days=KEY_TTL_DAYS)
        conn.run(
            f"UPDATE {SCHEMA}.stream_status SET stream_key=:k, key_expires_at=:e",
            k=new_key, e=new_expires,
        )
        return new_key, new_expires
    return current_key, expires_at


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    action = body.get("action") or (event.get("queryStringParameters") or {}).get("action", "")
    headers = event.get("headers") or {}

    # --- LOGIN ---
    if action == "login":
        password = body.get("password", "")
        admin_pwd = os.environ.get("ADMIN_PASSWORD", "")
        if password and admin_pwd and password == admin_pwd:
            return resp(200, {"ok": True, "token": password})
        return resp(401, {"ok": False, "error": "Неверный пароль"})

    if not check_token(headers):
        return resp(401, {"ok": False, "error": "Нет доступа"})

    conn = get_conn()

    # --- GET ALL DATA ---
    if action == "get_data":
        # Авторотация ключа
        stream_key, key_expires_at = maybe_rotate_key(conn)

        rows = conn.run(f"SELECT is_live, title, game, viewers FROM {SCHEMA}.stream_status LIMIT 1")
        r = rows[0]
        stream = {
            "is_live": r[0],
            "title": r[1],
            "game": r[2],
            "viewers": r[3],
            "stream_key": stream_key,
            "key_expires_at": str(key_expires_at) if key_expires_at else "",
        }

        rows = conn.run(f"SELECT id, day_short, time_msk, game, is_active FROM {SCHEMA}.schedule ORDER BY sort_order")
        schedule = [{"id": r[0], "day": r[1], "time": r[2], "game": r[3], "is_active": r[4]} for r in rows]

        rows = conn.run(f"SELECT id, donor_name, amount, message, is_read, created_at FROM {SCHEMA}.donates ORDER BY created_at DESC LIMIT 50")
        donates = [{"id": r[0], "name": r[1], "amount": r[2], "msg": r[3], "is_read": r[4], "created_at": r[5]} for r in rows]

        rows = conn.run(f"SELECT id, username, color, message, is_hidden, created_at FROM {SCHEMA}.chat_messages ORDER BY created_at DESC LIMIT 100")
        chat = [{"id": r[0], "user": r[1], "color": r[2], "text": r[3], "is_hidden": r[4], "created_at": r[5]} for r in rows]

        return resp(200, {"ok": True, "stream": stream, "schedule": schedule, "donates": donates, "chat": chat})

    # --- REGENERATE KEY MANUALLY ---
    if action == "regenerate_key":
        new_key = gen_stream_key()
        new_expires = datetime.now(timezone.utc) + timedelta(days=KEY_TTL_DAYS)
        conn.run(
            f"UPDATE {SCHEMA}.stream_status SET stream_key=:k, key_expires_at=:e",
            k=new_key, e=new_expires,
        )
        return resp(200, {"ok": True, "stream_key": new_key, "key_expires_at": str(new_expires)})

    # --- TOGGLE STREAM ---
    if action == "toggle_stream":
        conn.run(f"UPDATE {SCHEMA}.stream_status SET is_live = NOT is_live, updated_at = NOW()")
        rows = conn.run(f"SELECT is_live FROM {SCHEMA}.stream_status LIMIT 1")
        return resp(200, {"ok": True, "is_live": rows[0][0]})

    # --- UPDATE STREAM INFO ---
    if action == "update_stream":
        conn.run(
            f"UPDATE {SCHEMA}.stream_status SET title=:title, game=:game, updated_at=NOW()",
            title=body.get("title", ""),
            game=body.get("game", ""),
        )
        return resp(200, {"ok": True})

    # --- UPDATE / CREATE SCHEDULE ROW ---
    if action == "update_schedule":
        row_id = body.get("id")
        day = body.get("day", "")
        time_msk = body.get("time", "")
        game = body.get("game", "")
        is_active = body.get("is_active", True)
        if row_id:
            conn.run(
                f"UPDATE {SCHEMA}.schedule SET day_short=:day, time_msk=:time, game=:game, is_active=:active WHERE id=:id",
                day=day, time=time_msk, game=game, active=is_active, id=row_id,
            )
        else:
            conn.run(
                f"INSERT INTO {SCHEMA}.schedule (day_short, time_msk, game, is_active, sort_order) VALUES (:day,:time,:game,:active,(SELECT COALESCE(MAX(sort_order),0)+1 FROM {SCHEMA}.schedule))",
                day=day, time=time_msk, game=game, active=is_active,
            )
        return resp(200, {"ok": True})

    # --- DELETE SCHEDULE ROW ---
    if action == "delete_schedule":
        conn.run(f"DELETE FROM {SCHEMA}.schedule WHERE id=:id", id=body.get("id"))
        return resp(200, {"ok": True})

    # --- MARK DONATE READ ---
    if action == "mark_donate_read":
        conn.run(f"UPDATE {SCHEMA}.donates SET is_read=TRUE WHERE id=:id", id=body.get("id"))
        return resp(200, {"ok": True})

    # --- HIDE CHAT MESSAGE ---
    if action == "hide_chat_message":
        conn.run(f"UPDATE {SCHEMA}.chat_messages SET is_hidden=TRUE WHERE id=:id", id=body.get("id"))
        return resp(200, {"ok": True})

    # --- SEND CHAT MESSAGE (от имени стримера) ---
    if action == "send_chat_message":
        text = body.get("text", "").strip()
        if text:
            conn.run(
                f"INSERT INTO {SCHEMA}.chat_messages (username, color, message) VALUES (:u,:c,:m)",
                u="NEONKILL 👑", c="#ffd700", m=text,
            )
        return resp(200, {"ok": True})

    return resp(400, {"ok": False, "error": "Неизвестное действие"})
