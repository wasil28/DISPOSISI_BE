-- ============================================
-- MIGRATION: ADD AUDIT COLUMNS TO EXISTING TABLES
-- ============================================
-- Purpose: Add created_by, updated_by, created_at, updated_at columns
-- to tables that are missing them
-- Date: 2026-02-06
-- ============================================

-- ============================================
-- 1. ADD AUDIT COLUMNS TO t_bank_mutasi
-- ============================================

-- Add created_by and updated_by columns
ALTER TABLE t_bank_mutasi 
ADD COLUMN IF NOT EXISTS created_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(100);

-- Add created_at if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 't_bank_mutasi' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE t_bank_mutasi ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add updated_at if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 't_bank_mutasi' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE t_bank_mutasi ADD COLUMN updated_at TIMESTAMP;
    END IF;
END $$;

-- ============================================
-- 2. ADD AUDIT COLUMNS TO t_payment_patterns
-- ============================================

-- Add created_by and updated_by columns
ALTER TABLE t_payment_patterns 
ADD COLUMN IF NOT EXISTS created_by VARCHAR(100),
ADD COLUMN IF NOT EXISTS updated_by VARCHAR(100);

-- Add created_at if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 't_payment_patterns' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE t_payment_patterns ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add updated_at if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 't_payment_patterns' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE t_payment_patterns ADD COLUMN updated_at TIMESTAMP;
    END IF;
END $$;

-- ============================================
-- 3. VERIFY COLUMNS WERE ADDED
-- ============================================

-- Check t_bank_mutasi columns
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 't_bank_mutasi' 
    AND column_name IN ('created_by', 'updated_by', 'created_at', 'updated_at')
ORDER BY column_name;

-- Check t_payment_patterns columns
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 't_payment_patterns' 
    AND column_name IN ('created_by', 'updated_by', 'created_at', 'updated_at')
ORDER BY column_name;

-- ============================================
-- 4. UPDATE EXISTING RECORDS (OPTIONAL)
-- ============================================
-- Set default values for existing records

-- Update t_bank_mutasi existing records
UPDATE t_bank_mutasi 
SET 
    created_by = 'SYSTEM',
    updated_by = 'SYSTEM'
WHERE created_by IS NULL OR updated_by IS NULL;

-- Update t_payment_patterns existing records
UPDATE t_payment_patterns 
SET 
    created_by = 'SYSTEM',
    updated_by = 'SYSTEM'
WHERE created_by IS NULL OR updated_by IS NULL;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
