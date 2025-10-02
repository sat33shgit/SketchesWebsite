-- Contact Messages Table Schema
-- This table stores all contact form submissions for tracking and management

CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    country VARCHAR(100),
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'new',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better query performance
CREATE INDEX idx_contact_messages_email ON contact_messages(email);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);

-- Add trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION upupdated_at_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION upupdated_at_at_column();

-- Comments for documentation
COMMENT ON TABLE contact_messages IS 'Stores contact form submissions from website visitors';
COMMENT ON COLUMN contact_messages.id IS 'Primary key - auto-incrementing unique identifier';
COMMENT ON COLUMN contact_messages.name IS 'Name of the person sending the message (max 100 chars)';
COMMENT ON COLUMN contact_messages.email IS 'Email address of the sender';
COMMENT ON COLUMN contact_messages.subject IS 'Subject line of the message (max 200 chars)';
COMMENT ON COLUMN contact_messages.message IS 'Full message content (unlimited text)';
COMMENT ON COLUMN contact_messages.country IS 'Country of the sender (derived from IP, IP not stored)';
COMMENT ON COLUMN contact_messages.user_agent IS 'Browser/device information for analytics';
COMMENT ON COLUMN contact_messages.status IS 'Message status: new, replied, archived, spam';
COMMENT ON COLUMN contact_messages.is_read IS 'Boolean flag indicating if message has been read';
COMMENT ON COLUMN contact_messages.created_at IS 'Timestamp when message was submitted';
COMMENT ON COLUMN contact_messages.updated_at IS 'Timestamp when record was last modified';