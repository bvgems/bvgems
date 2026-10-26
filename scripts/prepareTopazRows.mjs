import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

const CLOUDINARY_MAP = JSON.parse(fs.readFileSync(path.resolve('./scripts/topaz_cloudinary_map.json'), 'utf-8'));

// Exact size definitions extracted from screenshots:
// 1. Swiss Blue
const SWISS_BLUE_SIZES = {
  "Round": [
    "1.00 mm", "1.25 mm", "2.00 mm", "2.25 mm", "2.50 mm", "2.75 mm",
    "3.00 mm", "3.25 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm",
    "5.50 mm", "6.00 mm", "6.50 mm", "7.00 mm", "8.00 mm"
  ],
  "Oval": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm", "18.00 x 13.00 mm"
  ],
  "Princess Cut": [
    "3.00 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm",
    "5.50 mm", "6.00 mm", "6.50 mm", "8.00 mm"
  ],
  "Emerald Cut": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm"
  ],
  "Pear": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 5.00 mm",
    "8.00 x 6.00 mm", "9.00 x 6.00 mm", "10.00 x 7.00 mm", "12.00 x 8.00 mm",
    "14.00 x 9.00 mm", "15.00 x 10.00 mm"
  ],
  "Marquise": [
    "4.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm", "8.00 x 4.00 mm",
    "10.00 x 5.00 mm", "12.00 x 6.00 mm", "14.00 x 7.00 mm"
  ],
  "Cushion": [
    "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm", "8.00 x 8.00 mm",
    "9.00 x 9.00 mm", "10.00 x 10.00 mm", "12.00 x 12.00 mm"
  ],
  "Trillion": [
    "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm",
    "8.00 x 8.00 mm", "9.00 x 9.00 mm"
  ],
  "Heart": [
    "3.00 x 3.00 mm", "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm",
    "7.00 x 7.00 mm", "8.00 x 8.00 mm", "9.00 x 9.00 mm", "10.00 x 10.00 mm"
  ],
  "Straight Baguette": [
    "4.00 x 2.00 mm", "5.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm",
    "8.00 x 4.00 mm"
  ]
};

// 2. London Blue
const LONDON_BLUE_SIZES = {
  "Round": [
    "1.00 mm", "1.25 mm", "1.50 mm", "1.75 mm", "2.00 mm", "2.25 mm", "2.50 mm", "2.75 mm",
    "3.00 mm", "3.25 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm", "5.50 mm",
    "6.00 mm", "6.50 mm", "7.00 mm", "8.00 mm", "9.00 mm", "10.00 mm"
  ],
  "Oval": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm", "18.00 x 13.00 mm"
  ],
  "Princess Cut": [
    "2.50 mm", "3.00 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm",
    "5.50 mm", "6.00 mm", "6.50 mm", "8.00 mm"
  ],
  "Emerald Cut": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm"
  ],
  "Pear": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 5.00 mm",
    "8.00 x 6.00 mm", "9.00 x 6.00 mm", "10.00 x 7.00 mm", "12.00 x 8.00 mm",
    "14.00 x 9.00 mm", "15.00 x 10.00 mm"
  ],
  "Marquise": [
    "4.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm", "8.00 x 4.00 mm",
    "10.00 x 5.00 mm", "12.00 x 6.00 mm", "14.00 x 7.00 mm"
  ],
  "Cushion": [
    "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm", "8.00 x 8.00 mm",
    "9.00 x 9.00 mm", "10.00 x 10.00 mm", "12.00 x 12.00 mm"
  ],
  "Trillion": [
    "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm",
    "8.00 x 8.00 mm", "9.00 x 9.00 mm"
  ],
  "Heart": [
    "3.00 x 3.00 mm", "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm",
    "7.00 x 7.00 mm", "8.00 x 8.00 mm", "9.00 x 9.00 mm", "10.00 x 10.00 mm"
  ],
  "Straight Baguette": [
    "4.00 x 2.00 mm", "5.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm",
    "8.00 x 4.00 mm"
  ]
};

// 3. Sky Blue
const SKY_BLUE_SIZES = {
  "Round": [
    "1.00 mm", "1.25 mm", "1.50 mm", "1.75 mm", "2.00 mm", "2.25 mm", "2.50 mm", "2.75 mm",
    "3.00 mm", "3.25 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm", "5.50 mm",
    "6.00 mm", "6.50 mm", "7.00 mm", "8.00 mm", "9.00 mm", "10.00 mm",
    "12.00 mm", "14.00 mm", "16.00 mm"
  ],
  "Oval": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm", "18.00 x 13.00 mm"
  ],
  "Princess Cut": [
    "2.50 mm", "3.00 mm", "3.50 mm", "4.00 mm", "4.50 mm", "5.00 mm",
    "5.50 mm", "6.00 mm", "6.50 mm", "7.00 mm", "8.00 mm"
  ],
  "Emerald Cut": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 6.00 mm",
    "9.00 x 7.00 mm", "10.00 x 8.00 mm", "11.00 x 9.00 mm", "12.00 x 10.00 mm",
    "14.00 x 10.00 mm", "14.00 x 12.00 mm", "16.00 x 12.00 mm"
  ],
  "Pear": [
    "5.00 x 3.00 mm", "6.00 x 4.00 mm", "7.00 x 5.00 mm", "8.00 x 5.00 mm",
    "8.00 x 6.00 mm", "9.00 x 6.00 mm", "10.00 x 7.00 mm", "12.00 x 8.00 mm",
    "14.00 x 9.00 mm", "15.00 x 10.00 mm", "24.00 x 8.00 mm", "30.00 x 10.00 mm"
  ],
  "Marquise": [
    "4.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm", "8.00 x 4.00 mm",
    "10.00 x 5.00 mm", "12.00 x 6.00 mm", "14.00 x 7.00 mm", "15.00 x 7.00 mm"
  ],
  "Cushion": [
    "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm", "8.00 x 8.00 mm",
    "9.00 x 9.00 mm", "10.00 x 10.00 mm", "12.00 x 12.00 mm"
  ],
  "Trillion": [
    "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm", "7.00 x 7.00 mm",
    "8.00 x 8.00 mm", "9.00 x 9.00 mm"
  ],
  "Heart": [
    "3.00 x 3.00 mm", "4.00 x 4.00 mm", "5.00 x 5.00 mm", "6.00 x 6.00 mm",
    "7.00 x 7.00 mm", "8.00 x 8.00 mm", "9.00 x 9.00 mm", "10.00 x 10.00 mm"
  ],
  "Straight Baguette": [
    "4.00 x 2.00 mm", "5.00 x 2.00 mm", "5.00 x 2.50 mm", "6.00 x 3.00 mm",
    "8.00 x 4.00 mm"
  ]
};

const cutByShape = {
  "Round": "Diamond Cut",
  "Princess Cut": "Princess-cut",
  "Emerald Cut": "Step-cut",
  "Straight Baguette": "Step-cut",
  "Oval": "Faceted",
  "Pear": "Faceted",
  "Marquise": "Faceted",
  "Cushion": "Faceted",
  "Trillion": "Faceted",
  "Heart": "Faceted"
};

async function main() {
  console.log("=== CHECKING AQUAMARINE CARAT WEIGHTS ===");
  const aqua = await pool.query("SELECT shape, size, ct_weight FROM gemstone_specs WHERE collection_slug = 'Aquamarine'");
  const aquaMap = new Map();
  aqua.rows.forEach(r => {
    aquaMap.set(`${r.shape}::${r.size.trim()}`, r.ct_weight);
  });

  const variants = [
    { name: "Swiss Blue", sizes: SWISS_BLUE_SIZES },
    { name: "London Blue", sizes: LONDON_BLUE_SIZES },
    { name: "Sky Blue", sizes: SKY_BLUE_SIZES }
  ];

  let totalRows = 0;
  let matchedWtCount = 0;
  let naWtCount = 0;
  const naSizesByShape = {};

  const allPreparedRows = [];

  for (const v of variants) {
    for (const [shape, sizes] of Object.entries(v.sizes)) {
      const imgKey = `${v.name}::${shape}`;
      const imgInfo = CLOUDINARY_MAP[imgKey];
      if (!imgInfo) {
        throw new Error(`Missing Cloudinary image for ${imgKey}`);
      }

      for (const s of sizes) {
        totalRows++;
        const aquaKey = `${shape}::${s}`;
        const ctWeight = aquaMap.get(aquaKey) || null;

        if (ctWeight) {
          matchedWtCount++;
        } else {
          naWtCount++;
          if (!naSizesByShape[shape]) naSizesByShape[shape] = new Set();
          naSizesByShape[shape].add(s);
        }

        allPreparedRows.push({
          collection_slug: "Topaz",
          color: v.name,
          shape: shape,
          size: s,
          quality: "AA",
          type: "Natural",
          cut: cutByShape[shape] || "Faceted",
          ct_weight: ctWeight,
          price: null,
          image_url: imgInfo.url,
          is_available: true
        });
      }
    }
  }

  console.log(`\nTotal Topaz rows to insert: ${totalRows}`);
  console.log(`Carat weights copied from Aquamarine: ${matchedWtCount}`);
  console.log(`Carat weights set to NA (NULL): ${naWtCount}`);

  console.log("\nSizes without Aquamarine weight (NA):");
  for (const [sh, set] of Object.entries(naSizesByShape)) {
    console.log(`  ${sh} (${set.size} sizes):`, Array.from(set).join(", "));
  }

  // Save prepared rows to JSON for safety/inspection
  fs.writeFileSync(path.resolve('./scripts/prepared_topaz_rows.json'), JSON.stringify(allPreparedRows, null, 2), 'utf-8');
  console.log("\nSaved prepared rows to scripts/prepared_topaz_rows.json");

  await pool.end();
}

main().catch(console.error);
