import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('Starting analytics database migration...');
    
    // Read the SQL migration file
    const sqlPath = path.join(__dirname, '..', 'database', 'analytics_schema.sql');
    const migrationSQL = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL statements (handling the complex view creation)
    const statements = migrationSQL
      .split(/;\s*(?=CREATE|INSERT|DROP|\n\n)/g)
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim().replace(/;$/, ''));
    
    console.log(`Found ${statements.length} SQL statements to execute...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        await sql.query(statement);
        console.log(`✓ Statement ${i + 1} completed`);
      }
    }
    
    console.log('✅ Analytics database migration completed successfully!');
    
    // Test the setup by checking table exists
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'page_visits'`;
    if (result.rows.length > 0) {
      console.log('✅ Confirmed: page_visits table created successfully');
    }
    
    // Check view exists
    const viewResult = await sql`SELECT table_name FROM information_schema.views WHERE table_name = 'analytics_summary'`;
    if (viewResult.rows.length > 0) {
      console.log('✅ Confirmed: analytics_summary view created successfully');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();