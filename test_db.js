const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const res = await pool.query('SELECT id, collection_slug, shape, ct_weight, dimension FROM free_size_gemstones ORDER BY created_at DESC LIMIT 50');
  console.log(res.rows.filter(r => !r.shape || !r.ct_weight));
  pool.end();
}
run();
