-- Add encrypted_key_iv column to t_backup_jobs table
ALTER TABLE t_backup_jobs 
ADD COLUMN encrypted_key_iv TEXT NULL;

-- Create t_master_keys table
CREATE TABLE t_master_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_key_encrypted TEXT NOT NULL,
    shares_generated_at TIMESTAMPTZ NULL,
    share_threshold INTEGER NOT NULL DEFAULT 2,
    total_shares INTEGER NOT NULL DEFAULT 3,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on is_active for faster lookups
CREATE INDEX idx_master_keys_is_active ON t_master_keys(is_active);

COMMENT ON TABLE t_master_keys IS 'Stores Master Key for encrypting backup encryption keys';
COMMENT ON COLUMN t_master_keys.master_key_encrypted IS 'Master Key encrypted with environment variable key';
COMMENT ON COLUMN t_master_keys.encrypted_key_iv IS 'Backup encryption Key+IV encrypted with Master Key';
