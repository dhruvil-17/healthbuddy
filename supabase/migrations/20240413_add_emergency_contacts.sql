-- Add emergency_contacts column to user_profiles table
-- This migration adds support for multiple emergency contacts

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS emergency_contacts JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance on emergency contacts queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_emergency_contacts 
ON user_profiles USING GIN (emergency_contacts);

-- Add comment to document the new column
COMMENT ON COLUMN user_profiles.emergency_contacts IS 'Array of emergency contact objects with name and phone fields';

-- Migration existing single emergency contact to multiple format (optional)
-- This will be handled in the application layer for safety
