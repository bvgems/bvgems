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
  if (file.includes('Hero.tsx')) continue; // Skip Hero to avoid lazy loading LCP
  
  const originalContent = fs.readFileSync(file, 'utf-8');
  
  // Replace <Image (with optional space/newline) with <Image loading="lazy" 
  // BUT only if loading="lazy" or fetchPriority isn't already there.
  // A safe regex:
  // Match `<Image ` or `<Image\n`
  // And avoid matching if the block already contains loading=
  // Actually, string replacement is easier.
  // Just find `<Image` and append `loading="lazy"`. If it already has it, it might duplicate, but we can clean it up.
  // Let's do a simple replace, then a cleanup replace.
  
  let newContent = originalContent.replace(/<Image(\s|\n)/g, '<Image loading="lazy"$1');
  // Clean up potential duplicates
  newContent = newContent.replace(/loading="lazy"(\s|\n)+loading="lazy"/g, 'loading="lazy"$1');
  
  if (originalContent !== newContent) {
    fs.writeFileSync(file, newContent, 'utf-8');
    updatedCount++;
  }
}

console.log(`Added lazy loading to ${updatedCount} files.`);
