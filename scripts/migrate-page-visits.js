#!/usr/bin/env node

// Script to migrate page_visits table - remove ip_hash and user_agent_hash, add country
import { sql } from '@vercel/postgres';
import 'dotenv/config';

async function migratePageVisits() {
  try {
    console.log('🔄 Starting migration of page_visits table...\n');

    // Step 1: Drop the unique constraint
    console.log('Step 1: Dropping old unique constraint...');
    await sql`
      ALTER TABLE page_visits 
      DROP CONSTRAINT IF EXISTS page_visits_page_type_page_id_ip_hash_user_agent_hash_key
    `;
    console.log('✅ Old constraint dropped\n');

    // Step 2: Drop ip_hash column
    console.log('Step 2: Dropping ip_hash column...');
    await sql`ALTER TABLE page_visits DROP COLUMN IF EXISTS ip_hash`;
    console.log('✅ ip_hash column dropped\n');

    // Step 3: Drop user_agent_hash column
    console.log('Step 3: Dropping user_agent_hash column...');
    await sql`ALTER TABLE page_visits DROP COLUMN IF EXISTS user_agent_hash`;
    console.log('✅ user_agent_hash column dropped\n');

    // Step 4: Add country column
    console.log('Step 4: Adding country column...');
    await sql`ALTER TABLE page_visits ADD COLUMN IF NOT EXISTS country VARCHAR(100)`;
    console.log('✅ country column added\n');

    // Step 5: Add new unique constraint
    console.log('Step 5: Adding new unique constraint...');
    await sql`
      ALTER TABLE page_visits 
      ADD CONSTRAINT page_visits_unique_page_country 
      UNIQUE(page_type, page_id, country)
    `;
    console.log('✅ New constraint added\n');

    // Step 6: Create index on country
    console.log('Step 6: Creating index on country...');
    await sql`CREATE INDEX IF NOT EXISTS idx_page_visits_country ON page_visits(country)`;
    console.log('✅ Index created\n');

    // Step 7: Update analytics_summary view
    console.log('Step 7: Updating analytics_summary view...');
    await sql`DROP VIEW IF EXISTS analytics_summary`;
    await sql`
      CREATE OR REPLACE VIEW analytics_summary AS
      SELECT 
          page_type,
          page_id,
          SUM(visit_count) as total_visits,
          COUNT(DISTINCT country) as unique_countries,
          MAX(updated_at) as last_visit
      FROM page_visits 
      GROUP BY page_type, page_id
      ORDER BY total_visits DESC
    `;
    console.log('✅ View updated\n');

    // Verify the migration
    console.log('Verifying migration...');
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'page_visits'
      ORDER BY ordinal_position
    `;
    
    console.log('\n📋 Current page_visits table structure:');
    console.table(result.rows);

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n⚠️  Note: Existing data has been preserved, but the ip_hash and user_agent_hash columns have been removed.');
    console.log('   You may want to clear old data and start fresh with country tracking.\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the migration
migratePageVisits();
