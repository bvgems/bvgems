const fs = require('fs');
const file = 'src/components/GridView/GridViewTopFilters.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `                  const baseGem = groupKey.split(" ")[0]; // e.g. "Sapphire" or "Aquamarine"
                  // Only render if the base gem is in selectedGems
                  if (!selectedGems.some(g => baseGem.toLowerCase() === g.toLowerCase())) return null;`;

const newStr = `                  const isSapphire = groupKey.toLowerCase().startsWith("sapphire");
                  const baseGem = isSapphire ? "Sapphire" : groupKey;
                  // Only render if the base gem is in selectedGems
                  if (!selectedGems.some(g => baseGem.toLowerCase() === g.toLowerCase())) return null;`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
console.log("Done");
