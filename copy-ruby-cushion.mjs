import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';

cloudinary.config({ 
  cloud_name: 'dabdvgxd4', 
  api_key: '455217358115358', 
  api_secret: 'vBXStEERtMGnfEEjGI4BnxWsG5I' 
});

const { Pool } = pg;
const pool = new Pool({
  host: 'db.zzudouifhwqapqsnlard.supabase.co',
  user: 'postgres',
  password: 'koksyr-ryvvyn-cantI0',
  database: 'postgres',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

async function uploadFile(filePath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      folder: 'gemstones',
      use_filename: true,
      unique_filename: false,
    });
    console.log(`Uploaded ${filePath} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (err) {
    console.error(`Failed to upload ${filePath}:`, err);
    throw err;
  }
}

async function run() {
  const urlA = await uploadFile('../ruby-A.png', 'ruby_cushion_a');
  const urlAA = await uploadFile('../ruby-AA.png', 'ruby_cushion_aa');
  
  const res = await pool.query(`
    SELECT quality, size, price, ct_weight, color, type
    FROM gemstone_specs 
    WHERE LOWER(collection_slug) = 'ruby' AND shape ILIKE 'oval' AND quality IN ('A', 'AA')
  `);
  
  const templateRows = res.rows;
  console.log(`Found ${templateRows.length} template rows. Inserting new rows...`);
  
  let count = 0;
  for (const row of templateRows) {
    const imageUrl = row.quality === 'A' ? urlA : urlAA;
    
    await pool.query(`
      INSERT INTO gemstone_specs (
        collection_slug, shape, quality, size, price, ct_weight, color, type, image_url, is_available
      ) VALUES (
        'Ruby', 'Cushion', $1, $2, $3, $4, $5, $6, $7, true
      )
    `, [row.quality, row.size, row.price, row.ct_weight, row.color, row.type, imageUrl]);
    
    count++;
  }
  
  console.log(`Successfully inserted ${count} rows for Ruby Cushion!`);
  pool.end();
}

run().catch(console.error);
