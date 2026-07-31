import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const shapeMap = {
  'princess cut': 'princessCut',
  'emerald cut': 'emeraldCut',
  'straight baguette': 'straightBaguette',
};

const gemMap = {
  'alexandrite': 'Alexandrite',
  'emerald': 'Emerald',
  'ruby': 'Ruby',
  'aquamarine': 'Aquamarine',
  'morganite': 'Morganite',
  'amethyst': 'Amethyst',
  'citrine': 'Citrine',
  'peridot': 'Peridot',
  'tanzanite': 'Tanzanite',
  'paraiba-tourmaline': 'ParaibaTourmaline',
  'sapphire': 'Sapphire'
};

async function fixDb() {
  console.log("Connecting to Database...");
  await client.connect();

  const result = await client.query(`SELECT id, collection_slug, shape, color, quality, cloudinary_videos FROM gemstone_specs WHERE cloudinary_videos IS NOT NULL`);
  
  let updatedCount = 0;

  for (const row of result.rows) {
    if (!row.cloudinary_videos || row.cloudinary_videos.length === 0) continue;
    
    let dbNeedsUpdate = false;
    const newVideos = [];

    const formattedShapeStr = row.shape ? row.shape.toLowerCase().trim() : '';
    const formattedShape = shapeMap[formattedShapeStr] || formattedShapeStr.replace(/\s+/g, '');
    
    let formattedGrade = row.quality ? row.quality.trim() : '';
    if (formattedGrade.toLowerCase().includes('lab')) formattedGrade = 'Lab';

    const formattedColor = row.color ? row.color.toLowerCase().trim() : '';
    const formattedGem = gemMap[row.collection_slug.toLowerCase()] || row.collection_slug;

    let targetFolder = '';
    if (formattedGem === 'Sapphire') {
      targetFolder = `Gemstone Videos/Sapphire/${formattedColor}-${formattedShape}/grade-${formattedGrade}`;
    } else {
      targetFolder = `Gemstone Videos/${formattedGem}/shape-${formattedShape}/grade-${formattedGrade}`;
    }

    for (const video of row.cloudinary_videos) {
      let currentPublicIdEncoded = video.video_url.split('/upload/')[1].replace('.mp4', '');
      let currentPublicId = decodeURI(currentPublicIdEncoded);
      
      if (!currentPublicId.startsWith('Gemstone Videos/')) {
        // It failed to update during the rename script because it was already renamed by another row!
        const filename = currentPublicId.split('/').pop();
        const targetPublicId = `${targetFolder}/${filename}`;
        
        console.log(`Fixing broken DB row ${row.id}: ${currentPublicId} -> ${targetPublicId}`);
        
        const newUrl = `https://res.cloudinary.com/${url.hostname}/video/upload/${encodeURI(targetPublicId)}.mp4`;
        
        newVideos.push({
          ...video,
          public_id: targetPublicId,
          video_url: newUrl
        });
        dbNeedsUpdate = true;
      } else {
        newVideos.push(video);
      }
    }

    if (dbNeedsUpdate) {
      await client.query(`UPDATE gemstone_specs SET cloudinary_videos = $1 WHERE id = $2`, [JSON.stringify(newVideos), row.id]);
      updatedCount++;
    }
  }

  console.log(`\n🎉 DB Fix Complete! Fixed ${updatedCount} rows.`);
  await client.end();
}

fixDb();
