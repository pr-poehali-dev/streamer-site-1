ALTER TABLE t_p62247026_streamer_site_1.stream_status
  ADD COLUMN IF NOT EXISTS key_expires_at TIMESTAMP NOT NULL DEFAULT NOW();

UPDATE t_p62247026_streamer_site_1.stream_status
  SET key_expires_at = NOW();
