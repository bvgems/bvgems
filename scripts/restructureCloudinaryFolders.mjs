import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = new URL(process.env.CLOUDINARY_URL.replace('cloudinary://', 'http://'));
cloudinary.config({
  cloud_name: url.hostname,
  api_key: url.username,
  api_secret: url.password,
  secure: true
});

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

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function restructureFolders() {
  console.log("Connecting to Database...");
  await client.connect();

  const result = await client.query(`SELECT id, collection_slug, shape, color, quality, cloudinary_videos FROM gemstone_specs WHERE cloudinary_videos IS NOT NULL`);
  
  let renamedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  console.log(`Processing ${result.rows.length} rows...`);

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
      const videoUrl = video.video_url;
      // Extract the full public_id from the URL (everything after /upload/ minus .mp4)
      const currentPublicIdEncoded = videoUrl.split('/upload/')[1].replace('.mp4', '');
      const currentPublicId = decodeURI(currentPublicIdEncoded);
      
      // Extract just the filename (e.g. IMG_0123_mp4)
      const filename = currentPublicId.split('/').pop();
      
      const targetPublicId = `${targetFolder}/${filename}`;

      if (currentPublicId !== targetPublicId) {
        console.log(`\nMoving: ${filename}`);
        console.log(`  From: ${currentPublicId}`);
        console.log(`  To:   ${targetPublicId}`);
        
        try {
          // Rename in Cloudinary (this physically moves it to the legacy folder)
          await cloudinary.uploader.rename(currentPublicId, targetPublicId, { resource_type: 'video', invalidate: true });
          
          // Wait 300ms to avoid hammering the API
          await delay(300);

          // Build new URL
          const newUrl = `https://res.cloudinary.com/${url.hostname}/video/upload/${encodeURI(targetPublicId)}.mp4`;
          
          newVideos.push({
            ...video,
            public_id: targetPublicId,
            video_url: newUrl
          });
          
          dbNeedsUpdate = true;
          renamedCount++;
        } catch (error) {
          // If the error is that it already exists, or not found, handle gracefully
          console.error(`  ❌ Cloudinary Error:`, error.message || error);
          failedCount++;
          // Push old video so we don't lose data
          newVideos.push(video);
        }
      } else {
        // Already in the correct place
        newVideos.push(video);
        skippedCount++;
      }
    }

    if (dbNeedsUpdate) {
      await client.query(`UPDATE gemstone_specs SET cloudinary_videos = $1 WHERE id = $2`, [JSON.stringify(newVideos), row.id]);
      console.log(`  ✅ Database updated for ID ${row.id}`);
    }
  }

  console.log(`\n🎉 Process Complete!`);
  console.log(`Renamed: ${renamedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Failed:  ${failedCount}`);
  await client.end();
}

restructureFolders();
