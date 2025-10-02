import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupConfigurations() {
  try {
    console.log('Starting configurations table setup...');
    
    // Read the SQL schema file
    const sqlPath = path.join(__dirname, '..', 'database', 'configurations_schema.sql');
    const schemaSQL = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL statements
    const statements = schemaSQL
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
    
    console.log('✅ Configurations table setup completed successfully!');
    
    // Test the setup by checking table exists
    const result = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'configurations'`;
    if (result.rows.length > 0) {
      console.log('✅ Confirmed: configurations table created successfully');
    }
    
    // Check default configuration
    const configResult = await sql`SELECT key, value FROM configurations WHERE key = 'comments_disable'`;
    if (configResult.rows.length > 0) {
      console.log('✅ Confirmed: Default configuration created:', configResult.rows[0]);
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupConfigurations();
