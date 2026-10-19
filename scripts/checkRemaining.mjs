import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function checkCorruptedInDB() {
  const corruptedFilenames = [
    'sapphire-blue-lab-grown-lab-grown-emerald-cut.png',
    'sapphire-pink-lab-grown-lab-grown-trillion.png',
    'sapphire-white-natural-aa-princess-cut.png',
    'sapphire-black-natural-a-pear.png',
    'emerald-green-natural-a-trillion.png'
  ];

  for (const f of corruptedFilenames) {
    const res = await pool.query('SELECT count(*) FROM gemstone_specs WHERE image_url ILIKE $1', ['%' + f + '%']);
    console.log(f, 'in DB gemstone_specs:', res.rows[0].count);
  }
  await pool.end();
}

checkCorruptedInDB();
