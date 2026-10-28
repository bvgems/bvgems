import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as XLSX from 'xlsx';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../../calibrated_gemstones_db_copy/gemstone_specs.json');
const imgJsonPath = path.resolve(__dirname, '../../calibrated_gemstones_db_copy/gemstone_images.json');

const outputXlsxFolder = path.resolve(__dirname, '../../calibrated_gemstones_db_copy');
const outputXlsx1 = path.join(outputXlsxFolder, 'BV_Gems_Calibrated_Stones_Database_Copy.xlsx');
const outputXlsxRoot = path.resolve(__dirname, '../../BV_Gems_Calibrated_Stones_Database_Copy.xlsx');

const specsRows = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const imagesRows = JSON.parse(fs.readFileSync(imgJsonPath, 'utf8'));

console.log(`Loaded ${specsRows.length} gemstone_specs rows and ${imagesRows.length} gemstone_images rows.`);

// Prepare gemstone_specs sheet data
const specsSheetData = specsRows.map(r => ({
  id: r.id,
  collection_slug: r.collection_slug,
  shape: r.shape,
  size: r.size,
  ct_weight: r.ct_weight !== null ? Number(r.ct_weight) : null,
  cut: r.cut,
  quality: r.quality,
  price: r.price !== null ? Number(r.price) : null,
  type: r.type,
  color: r.color,
  image_url: r.image_url,
  is_available: r.is_available,
  search_vector: r.search_vector,
  cloudinary_videos: r.cloudinary_videos ? JSON.stringify(r.cloudinary_videos) : '[]'
}));

const specsWs = XLSX.utils.json_to_sheet(specsSheetData);
specsWs['!cols'] = [
  { wch: 8 },   // id
  { wch: 18 },  // collection_slug
  { wch: 16 },  // shape
  { wch: 18 },  // size
  { wch: 12 },  // ct_weight
  { wch: 14 },  // cut
  { wch: 14 },  // quality
  { wch: 12 },  // price
  { wch: 14 },  // type
  { wch: 20 },  // color
  { wch: 50 },  // image_url
  { wch: 14 },  // is_available
  { wch: 35 },  // search_vector
  { wch: 35 }   // cloudinary_videos
];

// Prepare gemstone_images sheet data
const imagesSheetData = imagesRows.map(r => ({
  id: r.id,
  gemstone_id: r.gemstone_id,
  image_url: r.image_url
}));

const imagesWs = XLSX.utils.json_to_sheet(imagesSheetData);
imagesWs['!cols'] = [
  { wch: 10 },  // id
  { wch: 15 },  // gemstone_id
  { wch: 60 }   // image_url
];

// Prepare Summary Sheet
const byGem = {};
const byShape = {};
let naturalCount = 0;
let labGrownCount = 0;

for (const r of specsRows) {
  const gem = r.collection_slug;
  if (!byGem[gem]) {
    byGem[gem] = { gem, natural: 0, lab: 0, total: 0, prices: [] };
  }
  byGem[gem].total++;
  if (r.type === 'Natural') {
    byGem[gem].natural++;
    naturalCount++;
  } else if (r.type === 'Lab Grown') {
    byGem[gem].lab++;
    labGrownCount++;
  }
  if (r.price !== null && !isNaN(Number(r.price)) && Number(r.price) > 0) {
    byGem[gem].prices.push(Number(r.price));
  }

  const shp = r.shape || 'Unknown';
  byShape[shp] = (byShape[shp] || 0) + 1;
}

const summaryRows = [
  ['BV GEMS - CALIBRATED STONES DATABASE EXPORT'],
  ['Export Date', new Date().toISOString()],
  ['Total Calibrated Gemstones', specsRows.length],
  ['Total Gallery Images', imagesRows.length],
  ['Natural Gemstones', naturalCount],
  ['Lab Grown Gemstones', labGrownCount],
  [],
  ['GEMSTONE SUMMARY BREAKDOWN', '', '', '', '', '', ''],
  ['Gemstone Type', 'Natural Count', 'Lab Grown Count', 'Total Stones', 'Min Price ($)', 'Max Price ($)', 'Avg Price ($)']
];

const sortedGems = Object.values(byGem).sort((a, b) => b.total - a.total);
for (const g of sortedGems) {
  const minP = g.prices.length > 0 ? Math.min(...g.prices).toFixed(2) : 'N/A';
  const maxP = g.prices.length > 0 ? Math.max(...g.prices).toFixed(2) : 'N/A';
  const avgP = g.prices.length > 0 ? (g.prices.reduce((a, b) => a + b, 0) / g.prices.length).toFixed(2) : 'N/A';
  summaryRows.push([
    g.gem,
    g.natural,
    g.lab,
    g.total,
    minP !== 'N/A' ? Number(minP) : 'N/A',
    maxP !== 'N/A' ? Number(maxP) : 'N/A',
    avgP !== 'N/A' ? Number(avgP) : 'N/A'
  ]);
}

summaryRows.push([]);
summaryRows.push(['SHAPE BREAKDOWN', '', '']);
summaryRows.push(['Shape', 'Total Stones', 'Share of Total']);
const sortedShapes = Object.entries(byShape).sort((a, b) => b[1] - a[1]);
for (const [shp, count] of sortedShapes) {
  const pct = ((count / specsRows.length) * 100).toFixed(1) + '%';
  summaryRows.push([shp, count, pct]);
}

const summaryWs = XLSX.utils.aoa_to_sheet(summaryRows);
summaryWs['!cols'] = [
  { wch: 25 },
  { wch: 16 },
  { wch: 18 },
  { wch: 15 },
  { wch: 15 },
  { wch: 15 },
  { wch: 15 }
];

// Create workbook and append sheets
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, specsWs, 'gemstone_specs');
XLSX.utils.book_append_sheet(wb, imagesWs, 'gemstone_images');
XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary & Statistics');

// Write workbook to both paths
XLSX.writeFile(wb, outputXlsx1);
console.log(`Saved Excel copy to ${outputXlsx1} (${(fs.statSync(outputXlsx1).size / (1024 * 1024)).toFixed(2)} MB)`);

XLSX.writeFile(wb, outputXlsxRoot);
console.log(`Saved Excel copy to ${outputXlsxRoot} (${(fs.statSync(outputXlsxRoot).size / (1024 * 1024)).toFixed(2)} MB)`);

console.log('Single Excel workbook generation complete!');
