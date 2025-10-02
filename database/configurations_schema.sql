-- Configurations table for storing application settings
CREATE TABLE IF NOT EXISTS configurations (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_configurations_key ON configurations(key);

-- Insert default configuration for comments
INSERT INTO configurations (key, value) 
VALUES ('comments_disable', 'N')
ON CONFLICT (key) DO NOTHING;

-- Insert default configuration for contact messages
INSERT INTO configurations (key, value) 
VALUES ('message_disable', 'N')
ON CONFLICT (key) DO NOTHING;

-- Function to update date_updated automatically
CREATE OR REPLACE FUNCTION update_configuration_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.date_updated = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update date_updated
DROP TRIGGER IF EXISTS configurations_update_timestamp ON configurations;
CREATE TRIGGER configurations_update_timestamp
BEFORE UPDATE ON configurations
FOR EACH ROW
EXECUTE FUNCTION update_configuration_timestamp();
