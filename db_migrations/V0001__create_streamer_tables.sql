
CREATE TABLE t_p62247026_streamer_site_1.stream_status (
  id SERIAL PRIMARY KEY,
  is_live BOOLEAN NOT NULL DEFAULT FALSE,
  title VARCHAR(255) NOT NULL DEFAULT '',
  game VARCHAR(255) NOT NULL DEFAULT '',
  viewers INTEGER NOT NULL DEFAULT 0,
  stream_key VARCHAR(255) NOT NULL DEFAULT '',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO t_p62247026_streamer_site_1.stream_status (is_live, title, game, viewers, stream_key)
VALUES (FALSE, 'Escape from Tarkov', 'Escape from Tarkov', 0, '');

CREATE TABLE t_p62247026_streamer_site_1.schedule (
  id SERIAL PRIMARY KEY,
  day_short VARCHAR(10) NOT NULL,
  time_msk VARCHAR(10) NOT NULL,
  game VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO t_p62247026_streamer_site_1.schedule (day_short, time_msk, game, sort_order) VALUES
  ('ПН', '20:00', 'Valorant', 1),
  ('СР', '19:00', 'Cyberpunk 2077', 2),
  ('ПТ', '21:00', 'Escape from Tarkov', 3),
  ('СБ', '18:00', 'GTA VI', 4),
  ('ВС', '20:00', 'Apex Legends', 5);

CREATE TABLE t_p62247026_streamer_site_1.donates (
  id SERIAL PRIMARY KEY,
  donor_name VARCHAR(255) NOT NULL DEFAULT 'Аноним',
  amount INTEGER NOT NULL DEFAULT 0,
  message TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO t_p62247026_streamer_site_1.donates (donor_name, amount, message) VALUES
  ('DarkKnight', 500, 'За топовый хедшот! 🎯'),
  ('CyberCat', 200, 'Спасибо за стрим!'),
  ('NightRider', 1000, 'Ты лучший!');

CREATE TABLE t_p62247026_streamer_site_1.chat_messages (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL DEFAULT 'Гость',
  color VARCHAR(20) NOT NULL DEFAULT '#a855f7',
  message TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO t_p62247026_streamer_site_1.chat_messages (username, color, message) VALUES
  ('KiraStar', '#a855f7', 'Погнали! 🔥'),
  ('DarkFox88', '#00ffff', 'Го стрим!'),
  ('NightOwl', '#00ff88', 'Привет всем! Давно не заходил'),
  ('CyberWolf', '#ff00aa', 'Топ стример 🎮'),
  ('xXShadow', '#a855f7', 'Когда рейд?'),
  ('L1ghtning', '#00ffff', 'Погнали мочить!');
