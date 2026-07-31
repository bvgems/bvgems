import fs from 'fs';
import path from 'path';

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walkDir(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const srcFiles = walkDir(path.resolve(process.cwd(), 'src'));
let updatedCount = 0;

for (const file of srcFiles) {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx')) continue;
  
  const originalContent = fs.readFileSync(file, 'utf-8');
  // Match /assets/something.png or /assets/something.jpg or /assets/something.jpeg
  const newContent = originalContent.replace(/\/assets\/([^'"]+?)\.(png|jpg|jpeg)/gi, '/assets/$1.webp');
  
  if (originalContent !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    console.log(`Updated ${file}`);
    updatedCount++;
  }
}

console.log(`Updated extensions in ${updatedCount} files.`);
