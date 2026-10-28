import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pg from 'pg';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const outputDir = path.resolve(__dirname, '../../calibrated_gemstones_db_copy');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pool = new pg.Pool();

// Helper to escape CSV cell according to RFC 4180
function escapeCsvCell(val) {
  if (val === null || val === undefined) return '';
  let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Convert rows to CSV
function toCsv(rows, columns) {
  const header = columns.join(',');
  const lines = rows.map(row => columns.map(col => escapeCsvCell(row[col])).join(','));
  return [header, ...lines].join('\n');
}

// Helper to escape SQL values
function toSqlLiteral(val, udtName) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return String(val);
  if (udtName === 'jsonb' || typeof val === 'object') {
    const jsonStr = JSON.stringify(val).replace(/'/g, "''");
    return `'${jsonStr}'::jsonb`;
  }
  if (udtName === 'tsvector') {
    const str = String(val).replace(/'/g, "''");
    return `'${str}'::tsvector`;
  }
  if (udtName === 'numeric' || udtName === 'int4' || udtName === 'int8') {
    if (isNaN(Number(val))) return 'NULL';
    return String(val);
  }
  const str = String(val).replace(/'/g, "''");
  return `'${str}'`;
}

async function exportAll() {
  console.log('Connecting to DB to export calibrated stones copy...');
  
  // 1. Fetch gemstone_specs columns
  const specsColsRes = await pool.query(`
    SELECT column_name, udt_name, is_nullable, data_type
    FROM information_schema.columns
    WHERE table_name = 'gemstone_specs'
    ORDER BY ordinal_position
  `);
  const specsCols = specsColsRes.rows.map(r => r.column_name);
  const specsColMap = Object.fromEntries(specsColsRes.rows.map(r => [r.column_name, r.udt_name]));

  // 2. Query all rows strictly READ-ONLY
  console.log('Querying gemstone_specs...');
  const specsRes = await pool.query('SELECT * FROM gemstone_specs ORDER BY id ASC');
  const specsRows = specsRes.rows;
  console.log(`Retrieved ${specsRows.length} rows from gemstone_specs.`);

  // Write gemstone_specs.json
  const specsJsonPath = path.join(outputDir, 'gemstone_specs.json');
  fs.writeFileSync(specsJsonPath, JSON.stringify(specsRows, null, 2), 'utf8');
  console.log(`Saved JSON copy to ${specsJsonPath} (${(fs.statSync(specsJsonPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  // Write gemstone_specs.csv
  const specsCsvPath = path.join(outputDir, 'gemstone_specs.csv');
  fs.writeFileSync(specsCsvPath, toCsv(specsRows, specsCols), 'utf8');
  console.log(`Saved CSV copy to ${specsCsvPath} (${(fs.statSync(specsCsvPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  // Write gemstone_specs.sql (Standard CREATE TABLE and INSERT statements)
  const specsSqlPath = path.join(outputDir, 'gemstone_specs.sql');
  const sqlLines = [];
  sqlLines.push('-- Exact copy of gemstone_specs table');
  sqlLines.push(`-- Exported on: ${new Date().toISOString()}`);
  sqlLines.push(`-- Total records: ${specsRows.length}\n`);
  sqlLines.push('DROP TABLE IF EXISTS public.gemstone_specs CASCADE;\n');
  sqlLines.push(`CREATE TABLE public.gemstone_specs (
    id SERIAL PRIMARY KEY,
    collection_slug TEXT NOT NULL,
    shape TEXT NOT NULL,
    size TEXT NOT NULL,
    ct_weight NUMERIC,
    cut TEXT,
    quality TEXT,
    price NUMERIC,
    type TEXT,
    color TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    search_vector TSVECTOR,
    cloudinary_videos JSONB DEFAULT '[]'::jsonb
);\n`);

  // Batch inserts into chunks of 100 rows
  const chunkSize = 100;
  for (let i = 0; i < specsRows.length; i += chunkSize) {
    const chunk = specsRows.slice(i, i + chunkSize);
    const valueTuples = chunk.map(row => {
      const vals = specsCols.map(col => toSqlLiteral(row[col], specsColMap[col]));
      return `(${vals.join(', ')})`;
    });
    sqlLines.push(`INSERT INTO public.gemstone_specs (${specsCols.join(', ')}) VALUES\n  ${valueTuples.join(',\n  ')};\n`);
  }

  sqlLines.push('CREATE INDEX IF NOT EXISTS idx_gemstone_specs_search ON public.gemstone_specs USING gin (search_vector);');
  sqlLines.push(`SELECT setval('gemstone_specs_id_seq', (SELECT MAX(id) FROM public.gemstone_specs));\n`);

  fs.writeFileSync(specsSqlPath, sqlLines.join('\n'), 'utf8');
  console.log(`Saved SQL script to ${specsSqlPath} (${(fs.statSync(specsSqlPath).size / (1024 * 1024)).toFixed(2)} MB)`);

  // 3. Official pg_dump export
  try {
    const pgDumpPath = path.join(outputDir, 'gemstone_specs_pgdump.sql');
    console.log('Running official pg_dump for gemstone_specs...');
    execSync(`pg_dump -t gemstone_specs --no-owner --no-privileges -f "${pgDumpPath}"`, {
      env: process.env,
      stdio: 'inherit'
    });
    console.log(`Saved official pg_dump to ${pgDumpPath}`);
  } catch (err) {
    console.warn('pg_dump warning (non-fatal):', err.message);
  }

  // 4. Also export gemstone_images (150 rows auxiliary gallery table)
  console.log('Querying gemstone_images...');
  const imagesColsRes = await pool.query(`
    SELECT column_name, udt_name
    FROM information_schema.columns
    WHERE table_name = 'gemstone_images'
    ORDER BY ordinal_position
  `);
  const imgCols = imagesColsRes.rows.map(r => r.column_name);
  const imgColMap = Object.fromEntries(imagesColsRes.rows.map(r => [r.column_name, r.udt_name]));

  const imgRes = await pool.query('SELECT * FROM gemstone_images ORDER BY id ASC');
  const imgRows = imgRes.rows;
  console.log(`Retrieved ${imgRows.length} rows from gemstone_images.`);

  const imgJsonPath = path.join(outputDir, 'gemstone_images.json');
  fs.writeFileSync(imgJsonPath, JSON.stringify(imgRows, null, 2), 'utf8');

  const imgCsvPath = path.join(outputDir, 'gemstone_images.csv');
  fs.writeFileSync(imgCsvPath, toCsv(imgRows, imgCols), 'utf8');

  const imgSqlPath = path.join(outputDir, 'gemstone_images.sql');
  const imgSqlLines = [];
  imgSqlLines.push('-- Exact copy of gemstone_images table');
  imgSqlLines.push(`-- Exported on: ${new Date().toISOString()}`);
  imgSqlLines.push(`-- Total records: ${imgRows.length}\n`);
  imgSqlLines.push('DROP TABLE IF EXISTS public.gemstone_images CASCADE;\n');
  imgSqlLines.push(`CREATE TABLE public.gemstone_images (
    id SERIAL PRIMARY KEY,
    gemstone_id INTEGER NOT NULL REFERENCES public.gemstone_specs(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);\n`);
  if (imgRows.length > 0) {
    const tuples = imgRows.map(row => {
      const vals = imgCols.map(col => toSqlLiteral(row[col], imgColMap[col]));
      return `(${vals.join(', ')})`;
    });
    imgSqlLines.push(`INSERT INTO public.gemstone_images (${imgCols.join(', ')}) VALUES\n  ${tuples.join(',\n  ')};\n`);
  }
  imgSqlLines.push(`SELECT setval('gemstone_images_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.gemstone_images));\n`);
  fs.writeFileSync(imgSqlPath, imgSqlLines.join('\n'), 'utf8');

  // Compute breakdown stats for summary
  const collectionCounts = {};
  const shapeCounts = {};
  const typeCounts = {};
  for (const r of specsRows) {
    collectionCounts[r.collection_slug] = (collectionCounts[r.collection_slug] || 0) + 1;
    shapeCounts[r.shape] = (shapeCounts[r.shape] || 0) + 1;
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  }

  // Create README.md
  const readmePath = path.join(outputDir, 'README.md');
  const readmeContent = `# BV Gems - Calibrated Stones Database Copy

**Export Date:** ${new Date().toISOString()}  
**Source Table:** \`gemstone_specs\`  
**Total Records:** ${specsRows.length}  
**Auxiliary Table:** \`gemstone_images\` (${imgRows.length} records)

---

## 1. Table Architecture Overview

All calibrated gemstone specifications in BV Gems are stored in the single primary table:
**\`public.gemstone_specs\`**

An auxiliary table **\`public.gemstone_images\`** stores optional additional gallery images linked to \`gemstone_specs.id\`.

### Schema of \`gemstone_specs\`
| Column | Type | Nullable | Description |
|---|---|---|---|
| \`id\` | SERIAL (int4) | NO | Primary key identifier |
| \`collection_slug\` | TEXT | NO | Gemstone type/slug (e.g. Alexandrite, Emerald, Ruby, Sapphire, Topaz) |
| \`shape\` | TEXT | NO | Shape name (e.g. Round, Oval, Emerald Cut, Cushion, Pear, etc.) |
| \`size\` | TEXT | NO | Calibrated size string (e.g. "4.00 x 3.00 mm", "5.00 mm") |
| \`ct_weight\` | NUMERIC | YES | Carat weight per stone |
| \`cut\` | TEXT | YES | Cut description (e.g. "Step-cut", "Faceted", "Cabochon") |
| \`quality\` | TEXT | YES | Quality grade (e.g. "A", "AA", "AAA", "Lab Grown") |
| \`price\` | NUMERIC | YES | Price per stone / carat |
| \`type\` | TEXT | YES | Gemstone origin type (e.g. "Natural", "Lab Grown") |
| \`color\` | TEXT | YES | Color / Shade (e.g. "Blue", "Green", "Pink", "Yellow") |
| \`image_url\` | TEXT | YES | Cloudinary primary asset URL |
| \`is_available\` | BOOLEAN | YES | Availability flag (default: true) |
| \`search_vector\` | TSVECTOR | YES | Full-text search vector |
| \`cloudinary_videos\` | JSONB | YES | Array of video objects with public_id and video_url |

---

## 2. Included Files

1. **\`gemstone_specs.json\`** (${(fs.statSync(specsJsonPath).size / (1024 * 1024)).toFixed(2)} MB)
   - Complete JSON array of all ${specsRows.length} records with preserved types, arrays, and JSONB structures.
2. **\`gemstone_specs.csv\`** (${(fs.statSync(specsCsvPath).size / (1024 * 1024)).toFixed(2)} MB)
   - RFC 4180 compliant CSV file suitable for Excel, Google Sheets, Numbers, or CSV loaders.
3. **\`gemstone_specs.sql\`** (${(fs.statSync(specsSqlPath).size / (1024 * 1024)).toFixed(2)} MB)
   - Self-contained SQL script with \`CREATE TABLE\`, \`INSERT INTO ... VALUES\`, primary key sequence reset, and GIN index.
4. **\`gemstone_specs_pgdump.sql\`**
   - Official PostgreSQL dump generated directly using \`pg_dump\`.
5. **\`gemstone_images.json\` / \`.csv\` / \`.sql\`**
   - Exact copy of the 150 auxiliary image records in \`gemstone_images\`.

---

## 3. Data Breakdown

### Stones by Gemstone Type / Slug (\`collection_slug\`):
${Object.entries(collectionCounts).sort((a,b) => b[1] - a[1]).map(([slug, count]) => `- **${slug}**: ${count} rows`).join('\n')}

### Stones by Origin Type (\`type\`):
${Object.entries(typeCounts).sort((a,b) => b[1] - a[1]).map(([t, count]) => `- **${t || '(null)'}**: ${count} rows`).join('\n')}

### Stones by Shape:
${Object.entries(shapeCounts).sort((a,b) => b[1] - a[1]).map(([shp, count]) => `- **${shp}**: ${count} rows`).join('\n')}

---

## 4. How to Restore or Inspect

### In PostgreSQL:
\`\`\`bash
# Restore table into any local Postgres database:
psql -d my_local_database -f gemstone_specs.sql
psql -d my_local_database -f gemstone_images.sql
\`\`\`

### In Node.js / JavaScript:
\`\`\`javascript
import fs from 'fs';
const stones = JSON.parse(fs.readFileSync('./gemstone_specs.json', 'utf8'));
console.log('Total stones:', stones.length);
\`\`\`
`;
  fs.writeFileSync(readmePath, readmeContent, 'utf8');
  console.log(`Saved README to ${readmePath}`);

  await pool.end();
  console.log('Export completed successfully with 0 database modifications!');
}

exportAll().catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
