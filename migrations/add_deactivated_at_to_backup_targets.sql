-- Migration: Add deactivated_at column to t_backup_targets
-- Purpose: Track when a backup target was deactivated for historical accuracy
-- Date: 2026-01-23

-- Add deactivated_at column
ALTER TABLE t_backup_targets 
ADD COLUMN deactivated_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN t_backup_targets.deactivated_at IS 'Timestamp ketika target dinonaktifkan. NULL jika masih aktif atau belum pernah dinonaktifkan.';

-- Backfill: Set deactivated_at = updated_at for currently inactive targets
-- This provides an approximation for historical data
UPDATE t_backup_targets 
SET deactivated_at = updated_at 
WHERE is_active = false AND deactivated_at IS NULL;

-- Create index for performance on historical queries
CREATE INDEX idx_backup_targets_deactivated_at ON t_backup_targets(deactivated_at);

-- Verification query
SELECT 
  COUNT(*) as total_targets,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_targets,
  SUM(CASE WHEN is_active = false THEN 1 ELSE 0 END) as inactive_targets,
  SUM(CASE WHEN deactivated_at IS NOT NULL THEN 1 ELSE 0 END) as targets_with_deactivation_date
FROM t_backup_targets;
