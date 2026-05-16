ALTER TABLE t_p62247026_streamer_site_1.stream_status
  ADD COLUMN IF NOT EXISTS stream_url VARCHAR(500) NOT NULL DEFAULT 'rtmp://stream.neonkill.ru/live';
