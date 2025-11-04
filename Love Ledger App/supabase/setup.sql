-- Love Ledger - Database Setup Script
-- Run this in Supabase SQL Editor

-- Create KV Store table for contract storage
CREATE TABLE IF NOT EXISTS kv_store_c17b8718 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_kv_store_value 
ON kv_store_c17b8718 USING GIN (value);

-- Create index for prefix searches (for getByPrefix queries)
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_c17b8718 (key text_pattern_ops);

-- Enable Row Level Security
ALTER TABLE kv_store_c17b8718 ENABLE ROW LEVEL SECURITY;

-- Create policy: Allow service role full access
CREATE POLICY "Service role has full access"
  ON kv_store_c17b8718
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create policy: Allow anon role read access (untuk stats)
CREATE POLICY "Anon can read"
  ON kv_store_c17b8718
  FOR SELECT
  USING (true);

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_kv_store_updated_at ON kv_store_c17b8718;
CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON kv_store_c17b8718
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Love Ledger database setup completed successfully! ✨';
  RAISE NOTICE 'Table: kv_store_c17b8718';
  RAISE NOTICE 'Indexes: Created for value (GIN) and key (text_pattern_ops)';
  RAISE NOTICE 'RLS: Enabled with policies for service_role and anon';
  RAISE NOTICE 'Triggers: Auto-update for updated_at column';
END $$;
