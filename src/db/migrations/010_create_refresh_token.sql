CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  device_name TEXT,
  ip_address TEXT,
  user_agent TEXT,
  token_hash TEXT NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
CONSTRAINT fk_refresh_tokens_user_id
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE  
);

CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);