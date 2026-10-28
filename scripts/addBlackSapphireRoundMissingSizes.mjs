import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const pool = new pg.Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 5432),
  ssl: { rejectUnauthorized: false }
});

const SIZES_TO_ADD = [
  { size: '1.75 mm', ct_weight: 0.03 },
  { size: '2.25 mm', ct_weight: 0.05 },
  { size: '2.75 mm', ct_weight: 0.12 },
  { size: '3.25 mm', ct_weight: 0.16 },
  { size: '3.75 mm', ct_weight: 0.25 },
  { size: '4.25 mm', ct_weight: 0.41 },
  { size: '4.75 mm', ct_weight: 0.48 }
];

async function main() {
  console.log("==================================================");
  console.log("💎 Adding Missing Black Sapphire Round Sizes");
  console.log("==================================================\n");

  const client = await pool.connect();

  try {
    // 1. Template lookup for Black Sapphire Round
    const tmplRes = await client.query(`
      SELECT image_url, cut, is_available
      FROM gemstone_specs
      WHERE LOWER(collection_slug) = 'sapphire' 
        AND LOWER(color) = 'black' 
        AND shape = 'Round'
      LIMIT 1
    `);

    const tmpl = tmplRes.rows[0] || {
      image_url: 'https://res.cloudinary.com/oko8ywzn/image/upload/v1792690350/Gemstone%20Shapes/Sapphire/Black/A_TrueBlack/sapphire-black-natural-a-round.png',
      cut: 'Diamond Cut',
      is_available: true
    };

    console.log("Using template attributes for Black Sapphire Round:");
    console.log(`- image_url: ${tmpl.image_url}`);
    console.log(`- cut: ${tmpl.cut}`);

    // 2. Check which sizes already exist
    const existRes = await client.query(`
      SELECT size
      FROM gemstone_specs
      WHERE LOWER(collection_slug) = 'sapphire' 
        AND LOWER(color) = 'black' 
        AND shape = 'Round'
        AND size = ANY($1::text[])
    `, [SIZES_TO_ADD.map(s => s.size)]);

    const alreadyExist = new Set(existRes.rows.map(r => r.size));
    const toInsert = SIZES_TO_ADD.filter(s => !alreadyExist.has(s.size));

    console.log(`\nSizes requested to add: ${SIZES_TO_ADD.length}`);
    console.log(`Sizes already present:  ${alreadyExist.size}`);
    console.log(`Net sizes to insert:    ${toInsert.length}\n`);

    if (toInsert.length === 0) {
      console.log("All requested sizes already exist in the database.");
      return;
    }

    // 3. Begin Transaction
    await client.query("BEGIN");

    const insertedRows = [];
    for (const item of toInsert) {
      const searchContent = `Sapphire Round ${item.size} Black A Natural ${tmpl.cut || 'Diamond Cut'}`.trim();
      const insertSql = `
        INSERT INTO gemstone_specs (
          collection_slug,
          shape,
          size,
          ct_weight,
          cut,
          quality,
          price,
          type,
          color,
          image_url,
          is_available,
          search_vector,
          cloudinary_videos
        ) VALUES (
          'Sapphire',
          'Round',
          $1,
          $2,
          $3,
          'A',
          null,
          'Natural',
          'Black',
          $4,
          true,
          to_tsvector('english', $5),
          '[]'::jsonb
        )
        RETURNING id, size, ct_weight, color, quality;
      `;

      const res = await client.query(insertSql, [
        item.size,
        item.ct_weight,
        tmpl.cut || 'Diamond Cut',
        tmpl.image_url,
        searchContent
      ]);

      insertedRows.push(res.rows[0]);
      console.log(`✅ Added Black Sapphire Round: ${item.size} (${item.ct_weight} ct) -> ID ${res.rows[0].id}`);
    }

    await client.query("COMMIT");
    console.log("\n🎉 Transaction committed successfully!");

    // 4. Verify all sizes now match Blue Sapphire
    const blueSizesRes = await client.query(`
      SELECT DISTINCT size 
      FROM gemstone_specs 
      WHERE LOWER(collection_slug) = 'sapphire' AND color = 'Blue' AND shape = 'Round' AND type = 'Natural'
      ORDER BY size
    `);
    const blackSizesRes = await client.query(`
      SELECT DISTINCT size 
      FROM gemstone_specs 
      WHERE LOWER(collection_slug) = 'sapphire' AND color = 'Black' AND shape = 'Round' AND type = 'Natural'
      ORDER BY size
    `);

    const blueList = blueSizesRes.rows.map(r => r.size);
    const blackList = blackSizesRes.rows.map(r => r.size);

    console.log("\n==================================================");
    console.log(`Total Blue Sapphire Round sizes:  ${blueList.length}`);
    console.log(`Total Black Sapphire Round sizes: ${blackList.length}`);
    const missingNow = blueList.filter(s => !blackList.includes(s));
    console.log(`Missing sizes in Black now:       ${missingNow.length} ${missingNow.length > 0 ? missingNow.join(', ') : '(None - 100% Match!)'}`);
    console.log("==================================================");

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error, transaction rolled back:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
