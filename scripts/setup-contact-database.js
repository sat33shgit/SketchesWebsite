#!/usr/bin/env node

// Script to set up the contact messages database table
import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function setupContactDatabase() {
  try {
    console.log('Setting up contact messages database table...');

    // Create the contact_messages table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(200) NOT NULL,
          message TEXT NOT NULL,
          ip_address INET,
          user_agent TEXT,
          status VARCHAR(20) DEFAULT 'new',
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Contact messages table created/verified');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read)`;

    console.log('✅ Indexes created/verified');

    // Create the update trigger function
    await sql`
      CREATE OR REPLACE FUNCTION upupdated_at_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql'
    `;

    console.log('✅ Trigger function created/verified');

    // Create the trigger
    await sql`
      DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages
    `;
    await sql`
      CREATE TRIGGER update_contact_messages_updated_at
          BEFORE UPDATE ON contact_messages
          FOR EACH ROW
          EXECUTE FUNCTION upupdated_at_at_column()
    `;

    console.log('✅ Trigger created/verified');

    // Test a simple query to verify everything works
    const testResult = await sql`SELECT COUNT(*) as count FROM contact_messages`;
    console.log(`✅ Database connection verified. Current message count: ${testResult.rows[0].count}`);

    console.log('\n🎉 Contact database setup completed successfully!');

  } catch (error) {
    console.error('❌ Error setting up contact database:', error);
    console.error('Full error details:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupContactDatabase();