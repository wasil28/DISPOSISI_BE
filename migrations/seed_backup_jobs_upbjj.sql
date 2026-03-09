-- Seed Backup Jobs for UPBJJ Users
-- This creates 5-10 random backup jobs for each user with id_upbjj
-- Run this after seed_users_upbjj.sql

DO $$
DECLARE
    user_record RECORD;
    job_count INTEGER;
    i INTEGER;
    random_status TEXT;
    random_size BIGINT;
    random_days_ago INTEGER;
BEGIN
    -- Loop through all users that have id_upbjj
    FOR user_record IN 
        SELECT id, email, nama_user, id_upbjj 
        FROM m_users 
        WHERE id_upbjj IS NOT NULL
    LOOP
        -- Random number of jobs per user (5-10)
        job_count := 5 + floor(random() * 6)::INTEGER;
        
        FOR i IN 1..job_count LOOP
            -- Random status: completed, failed, or in_progress
            random_status := CASE floor(random() * 10)::INTEGER
                WHEN 0 THEN 'failed'
                WHEN 1 THEN 'in_progress'
                ELSE 'completed'
            END;
            
            -- Random file size between 100MB and 10GB (as INTEGER)
            random_size := (100000000 + floor(random() * 9900000000))::BIGINT;
            
            -- Random days ago (0-90 days)
            random_days_ago := floor(random() * 91)::INTEGER;
            
            -- Insert backup job with UUID
            INSERT INTO t_backup_jobs (
                id,
                user_id,
                target_id,
                status,
                file_size_bytes,
                storage_path,
                created_at,
                updated_at
            ) VALUES (
                gen_random_uuid(),
                user_record.id,
                1, -- Default target_id, adjust if needed
                random_status,
                random_size,
                '/backup/' || user_record.email || '/' || gen_random_uuid()::TEXT || '.tar.gz',
                NOW() - (random_days_ago || ' days')::INTERVAL,
                NOW() - (random_days_ago || ' days')::INTERVAL
            );
        END LOOP;
        
        RAISE NOTICE 'Created % backup jobs for user: %', job_count, user_record.email;
    END LOOP;
END $$;

-- Verify insertion
SELECT 
    u.nama_upbjj,
    COUNT(DISTINCT m.id) as total_users,
    COUNT(bj.id) as total_backup_jobs,
    ROUND(AVG(CASE WHEN bj.id IS NOT NULL THEN 1 ELSE 0 END) * COUNT(bj.id) / NULLIF(COUNT(DISTINCT m.id), 0), 2) as avg_jobs_per_user
FROM m_upbjj u
LEFT JOIN m_users m ON m.id_upbjj = u.id
LEFT JOIN t_backup_jobs bj ON bj.user_id = m.id
WHERE u.status_aktif = 1
GROUP BY u.id, u.nama_upbjj
HAVING COUNT(DISTINCT m.id) > 0
ORDER BY total_backup_jobs DESC, u.nama_upbjj;
