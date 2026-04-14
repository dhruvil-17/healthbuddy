-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, responded, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert (for API)
CREATE POLICY "Service role can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to select (for admin panel)
CREATE POLICY "Service role can select contact messages"
  ON contact_messages
  FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to update (for admin panel)
CREATE POLICY "Service role can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO service_role
  USING (true);

-- Allow service role to delete (for admin panel)
CREATE POLICY "Service role can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO service_role
  USING (true);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
