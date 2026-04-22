-- Performance Optimization: Add indexes for frequently queried fields
-- Run this in Supabase SQL Editor to improve query performance

-- Index on user_profiles.id (primary key already exists, but ensure it's indexed)
-- This is already indexed by default as primary key

-- Index on medicine_reminders.user_id for faster reminder lookups
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user_id 
ON medicine_reminders(user_id);

-- Index on medicine_logs.user_id for faster log lookups
CREATE INDEX IF NOT EXISTS idx_medicine_logs_user_id 
ON medicine_logs(user_id);

-- Index on medicine_logs.reminder_id for faster reminder-specific log queries
CREATE INDEX IF NOT EXISTS idx_medicine_logs_reminder_id 
ON medicine_logs(reminder_id);

-- Index on medicine_logs.log_date for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_medicine_logs_log_date 
ON medicine_logs(log_date);

-- Composite index on medicine_logs for user + date queries
CREATE INDEX IF NOT EXISTS idx_medicine_logs_user_date 
ON medicine_logs(user_id, log_date);

-- Index on health_tips_history.user_id for faster tip history lookups
CREATE INDEX IF NOT EXISTS idx_health_tips_history_user_id 
ON health_tips_history(user_id);

-- Index on health_tips_history.created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_health_tips_history_created_at 
ON health_tips_history(created_at DESC);

-- Index on user_profiles.email for authentication lookups (if used)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email 
ON user_profiles(email);

-- Comment on what these indexes do
COMMENT ON INDEX idx_medicine_reminders_user_id IS 'Speeds up reminder queries by user';
COMMENT ON INDEX idx_medicine_logs_user_id IS 'Speeds up medicine log queries by user';
COMMENT ON INDEX idx_medicine_logs_reminder_id IS 'Speeds up log queries by reminder';
COMMENT ON INDEX idx_medicine_logs_log_date IS 'Speeds up date-based log queries';
COMMENT ON INDEX idx_medicine_logs_user_date IS 'Speeds up combined user+date queries';
COMMENT ON INDEX idx_health_tips_history_user_id IS 'Speeds up health tips history queries';
COMMENT ON INDEX idx_health_tips_history_created_at IS 'Speeds up sorting tips by creation date';
COMMENT ON INDEX idx_user_profiles_email IS 'Speeds up profile lookups by email';
