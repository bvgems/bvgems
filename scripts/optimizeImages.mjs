import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const assetsDir = path.resolve(process.cwd(), 'public/assets');

async function processImages() {
  const files = fs.readdirSync(assetsDir);
  
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    
    // Only process png, jpg, jpeg
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
      continue;
    }

    const inputPath = path.join(assetsDir, file);
    const basename = path.basename(file, ext);
    const outputPath = path.join(assetsDir, `${basename}.webp`);
    
    try {
      const metadata = await sharp(inputPath).metadata();
      const width = metadata.width;
      
      let transform = sharp(inputPath);
      
      // If the image is excessively large, scale it down.
      // E.g. thumbnails shouldn't be larger than 1200px.
      // (Banners like hero-bg can stay large, but sharp will still compress them heavily as webp).
      if (width > 1200) {
        transform = transform.resize({ width: 1200, withoutEnlargement: true });
      }

      await transform
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);
        
      console.log(`✅ Converted ${file} -> ${basename}.webp`);
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err);
    }
  }
}

processImages();
