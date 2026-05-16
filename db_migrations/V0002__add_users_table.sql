
CREATE TABLE t_p62247026_streamer_site_1.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  color VARCHAR(20) NOT NULL DEFAULT '#a855f7',
  location VARCHAR(100) NOT NULL DEFAULT '',
  avatar_url VARCHAR(500) NOT NULL DEFAULT '',
  session_token VARCHAR(255) NOT NULL DEFAULT '',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE t_p62247026_streamer_site_1.chat_messages
  ADD COLUMN IF NOT EXISTS user_id INTEGER;
