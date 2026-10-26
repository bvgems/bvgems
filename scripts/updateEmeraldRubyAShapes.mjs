import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import pg from 'pg';

dotenv.config();

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
  cloudinary.config({
    cloud_name: url.hostname,
    api_key: url.username,
    api_secret: url.password,
    secure: true
  });
} else {
  console.error("❌ CLOUDINARY_URL not found in environment.");
  process.exit(1);
}

const ASSETS_ROOT = '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 3';
const CACHE_PATH = path.resolve('./scripts/uploaded_shapes_cache.json');

const TARGET_ASSETS = [
  // Emerald Natural A (10 shapes)
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Round',
    asset_path: 'emerald/green/a/emerald-green-natural-a-round.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-round'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Oval',
    asset_path: 'emerald/green/a/emerald-green-natural-a-oval.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-oval'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Emerald Cut',
    asset_path: 'emerald/green/a/emerald-green-natural-a-emerald-cut.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-emerald-cut'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Pear',
    asset_path: 'emerald/green/a/emerald-green-natural-a-pear.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-pear'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Princess Cut',
    asset_path: 'emerald/green/a/emerald-green-natural-a-princess-cut.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-princess-cut'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Marquise',
    asset_path: 'emerald/green/a/emerald-green-natural-a-marquise.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-marquise'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Heart',
    asset_path: 'emerald/green/a/emerald-green-natural-a-heart.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-heart'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Straight Baguette',
    asset_path: 'emerald/green/a/emerald-green-natural-a-straight-baguette.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-straight-baguette'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Cushion',
    asset_path: 'emerald/green/a/emerald-green-natural-a-cushion.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-cushion'
  },
  {
    category: 'Emerald',
    color: 'Green',
    quality: 'A',
    shape: 'Trillion',
    asset_path: 'emerald/green/a/emerald-green-natural-a-trillion.png',
    public_id: 'Gemstone Shapes/Emerald/Green/A/emerald-green-natural-a-trillion'
  },
  // Ruby Natural A (10 shapes)
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Round',
    asset_path: 'ruby/red/a/ruby-red-natural-a-round.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-round'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Oval',
    asset_path: 'ruby/red/a/ruby-red-natural-a-oval.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-oval'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Emerald Cut',
    asset_path: 'ruby/red/a/ruby-red-natural-a-emerald-cut.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-emerald-cut'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Pear',
    asset_path: 'ruby/red/a/ruby-red-natural-a-pear.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-pear'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Princess Cut',
    asset_path: 'ruby/red/a/ruby-red-natural-a-princess-cut.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-princess-cut'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Marquise',
    asset_path: 'ruby/red/a/ruby-red-natural-a-marquise.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-marquise'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Heart',
    asset_path: 'ruby/red/a/ruby-red-natural-a-heart.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-heart'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Straight Baguette',
    asset_path: 'ruby/red/a/ruby-red-natural-a-straight-baguette.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-straight-baguette'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Cushion',
    asset_path: 'ruby/red/a/ruby-red-natural-a-cushion.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-cushion'
  },
  {
    category: 'Ruby',
    color: 'Red',
    quality: 'A',
    shape: 'Trillion',
    asset_path: 'ruby/red/a/ruby-red-natural-a-trillion.png',
    public_id: 'Gemstone Shapes/Ruby/Red/A/ruby-red-natural-a-trillion'
  }
];

async function main() {
  console.log("==================================================");
  console.log("💎 Updating Emerald A and Ruby A Shape Assets (Revision 5)");
  console.log("==================================================\n");

  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

  // 1. Safety Backup
  console.log("🛡️ Checking / creating database safety backup table...");
  await pool.query(`
    CREATE TABLE IF NOT EXISTS gemstone_specs_backup_20261026 AS 
    SELECT * FROM gemstone_specs;
  `);
  const backupCount = await pool.query(`SELECT count(*) FROM gemstone_specs_backup_20261026`);
  console.log(`✅ Safety backup table 'gemstone_specs_backup_20261026' has ${backupCount.rows[0].count} records.\n`);

  // 2. Load Cache
  let cache = {};
  if (fs.existsSync(CACHE_PATH)) {
    cache = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf-8'));
  }

  // 3. Upload each of the 20 assets to Cloudinary
  console.log("📤 Uploading 20 shape assets to Cloudinary...");
  const uploadResults = [];

  for (const item of TARGET_ASSETS) {
    const localPath = path.join(ASSETS_ROOT, item.asset_path);
    if (!fs.existsSync(localPath)) {
      throw new Error(`Local file missing: ${localPath}`);
    }

    console.log(`\n⬆️ Uploading: ${item.category} A ${item.shape} (${item.asset_path})`);
    console.log(`   Target Public ID: ${item.public_id}`);

    const res = await cloudinary.uploader.upload(localPath, {
      public_id: item.public_id,
      overwrite: true,
      invalidate: true,
      resource_type: "image",
      tags: ["representative_gemstone_shape", item.category, item.shape, item.quality, "revision_5"]
    });

    console.log(`   ✅ Success! URL: ${res.secure_url}`);

    const assetEntry = {
      secure_url: res.secure_url,
      public_id: res.public_id,
      width: res.width,
      height: res.height,
      format: res.format,
      category: item.category,
      color: item.color,
      type: 'Natural',
      quality: item.quality,
      shape: item.shape,
      uploaded_at: new Date().toISOString()
    };

    cache[item.asset_path] = assetEntry;
    uploadResults.push({ ...item, secure_url: res.secure_url });
  }

  // Save updated cache
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf-8');
  console.log(`\n💾 Saved updated cache to ${CACHE_PATH}`);

  // 4. Update gemstone_specs table
  console.log("\n🗄️ Updating PostgreSQL gemstone_specs table...");
  let totalRowsUpdated = 0;
  const shapeUpdateSummary = [];

  for (const item of uploadResults) {
    const updateQuery = `
      UPDATE gemstone_specs
      SET image_url = $1
      WHERE LOWER(collection_slug) = LOWER($2)
        AND LOWER(shape) = LOWER($3)
        AND LOWER(quality) = 'a'
        AND (LOWER(type) = 'natural' OR type IS NULL)
      RETURNING id, size, ct_weight;
    `;

    const res = await pool.query(updateQuery, [item.secure_url, item.category, item.shape]);
    const count = res.rowCount || 0;
    totalRowsUpdated += count;
    shapeUpdateSummary.push({
      category: item.category,
      shape: item.shape,
      quality: 'A',
      rowsUpdated: count,
      url: item.secure_url
    });
    console.log(`   Updated ${count} rows for ${item.category} A ${item.shape}`);
  }

  console.log(`\n🎉 Total database rows updated: ${totalRowsUpdated}`);

  // 5. Verify database contents
  console.log("\n🔍 Verifying database counts and URLs...");
  const emVerify = await pool.query(`
    SELECT shape, count(*), count(CASE WHEN image_url LIKE '%/Emerald/Green/A/%' THEN 1 END) as new_url_count, min(image_url) as sample_url
    FROM gemstone_specs
    WHERE LOWER(collection_slug) = 'emerald' AND LOWER(quality) = 'a'
    GROUP BY shape ORDER BY shape;
  `);
  console.log("Emerald A verification:");
  console.table(emVerify.rows);

  const ruVerify = await pool.query(`
    SELECT shape, count(*), count(CASE WHEN image_url LIKE '%/Ruby/Red/A/%' THEN 1 END) as new_url_count, min(image_url) as sample_url
    FROM gemstone_specs
    WHERE LOWER(collection_slug) = 'ruby' AND LOWER(quality) = 'a'
    GROUP BY shape ORDER BY shape;
  `);
  console.log("Ruby A verification:");
  console.table(ruVerify.rows);

  // 6. Also sync the 20 files to the other local BV asset directories
  console.log("\n📁 Syncing updated 20 files to other local asset folders...");
  const otherRoots = [
    '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets',
    '/Users/meetpatel/Desktop/BV/BV_Gems_Individual_Shape_Assets 2',
    '/Users/meetpatel/Desktop/BV/Oct19/BV_Gems_Individual_Shape_Assets'
  ];

  for (const targetRoot of otherRoots) {
    if (fs.existsSync(targetRoot)) {
      for (const item of TARGET_ASSETS) {
        const srcFile = path.join(ASSETS_ROOT, item.asset_path);
        const destFile = path.join(targetRoot, item.asset_path);
        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        fs.copyFileSync(srcFile, destFile);
      }
      console.log(`   ✅ Synced 20 files to: ${targetRoot}`);
    }
  }

  await pool.end();
  console.log("\n✨ All operations completed successfully!");
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
