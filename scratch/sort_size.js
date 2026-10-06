const fs = require('fs');
const file = 'src/components/GridView/GridView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `    setDisplayItems(filtered);
    setVisibleCount(ITEMS_PER_PAGE);`;

const newStr = `    // Sort all filtered items by size ascending
    filtered.sort((a, b) => {
      const sizeA = String(a.size || "");
      const sizeB = String(b.size || "");
      return sizeA.localeCompare(sizeB, undefined, { numeric: true });
    });

    setDisplayItems(filtered);
    setVisibleCount(ITEMS_PER_PAGE);`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
console.log("Done");
