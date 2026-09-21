const fs = require('fs');
const content = fs.readFileSync('src/utils/constants.ts', 'utf8');
const images = [...content.matchAll(/image:\s*"([^"]+)"/g)].map(m => m[1]);
const shopImages = [...content.matchAll(/shopImage:\s*"([^"]+)"/g)].map(m => m[1]);

const allImages = Array.from(new Set([...images, ...shopImages]));

for (const img of allImages) {
  if (img.startsWith('/assets')) {
    const path = 'public' + img;
    if (!fs.existsSync(path)) {
      console.log(`MISSING IMAGE: ${path}`);
    }
  }
}
