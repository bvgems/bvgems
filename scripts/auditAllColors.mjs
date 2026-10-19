import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const colors = [
  'Red', 'Pink', 'Blue', 'Purple', 'Green', 'Yellow',
  'Orange', 'White', 'Brown', 'Peach', 'Black', 'Teal'
];

async function checkAllColors() {
  console.log('Color'.padEnd(10), '| Calibrated Count | Free Size Count | Matching Calibrated Gemstone Types');
  console.log('-'.repeat(95));

  for (const c of colors) {
    const pattern = `%${c}%`;
    const cal = await pool.query(
      'SELECT collection_slug, count(*) as count FROM gemstone_specs WHERE color ILIKE $1 GROUP BY collection_slug',
      [pattern]
    );

    const totalCal = cal.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
    const calTypes = cal.rows.map(r => `${r.collection_slug} (${r.count})`).join(', ');

    const fs = await pool.query(
      'SELECT gemstone_type, count(*) as count FROM free_size_gemstones WHERE color ILIKE $1 GROUP BY gemstone_type',
      [pattern]
    );
    const totalFs = fs.rows.reduce((sum, r) => sum + parseInt(r.count), 0);
    const fsTypes = fs.rows.map(r => `${r.gemstone_type} (${r.count})`).join(', ');

    console.log(
      c.padEnd(10), '|',
      String(totalCal).padStart(16), '|',
      String(totalFs).padStart(15), '|',
      calTypes || 'NONE (0 items)'
    );
  }

  console.log('\n=== All colors and their gemstone types in gemstone_specs (Calibrated) ===');
  const otherColors = await pool.query(`
    SELECT color, collection_slug, count(*) 
    FROM gemstone_specs 
    GROUP BY color, collection_slug 
    ORDER BY count DESC
  `);
  for (const r of otherColors.rows) {
    console.log(r.color.padEnd(18), r.collection_slug.padEnd(20), r.count);
  }

  await pool.end();
}

checkAllColors().catch(console.error);
