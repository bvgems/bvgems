import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
  host: 'db.zzudouifhwqapqsnlard.supabase.co',
  user: 'postgres',
  password: 'koksyr-ryvvyn-cantI0',
  database: 'postgres',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  const res = await pool.query(`
    SELECT quality, size, price, ct_weight, color 
    FROM gemstone_specs 
    WHERE LOWER(collection_slug) = 'ruby' AND shape ILIKE 'oval' AND quality IN ('A', 'AA')
  `);
  console.log(`Found ${res.rows.length} rows for Ruby Oval A and AA.`);
  console.table(res.rows);
  pool.end();
}
run().catch(console.error);
