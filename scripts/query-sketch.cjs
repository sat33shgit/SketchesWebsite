require('dotenv/config')
const { sql } = require('@vercel/postgres')

const id = process.argv[2] || '11'

;(async () => {
  try {
    console.log('Running DB diagnostics...')
    const v = await sql`SELECT version()`
    console.log('Postgres version:', v && v.rows && v.rows[0] && v.rows[0].version)

    const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename`;
    console.log('Public tables:', JSON.stringify(tables.rows, null, 2))

    const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'sketches'`;
    console.log("Columns for 'sketches':", JSON.stringify(cols.rows, null, 2))

    console.log(`Attempting to SELECT from sketches WHERE id = ${id}`)
    const res = await sql`SELECT * FROM sketches WHERE id = ${id} LIMIT 1`
    console.log('DB query success. Row:')
    console.log(JSON.stringify(res.rows, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('DB query failed:', err && (err.message || err))
    if (err && err.code) console.error('Error code:', err.code)
    process.exit(2)
  }
})()
