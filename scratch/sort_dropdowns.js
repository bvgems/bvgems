const fs = require('fs');
const file = 'src/components/GridView/GridViewTopFilters.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldMap = `                // If specific gems are selected, render their dropdowns
                return Object.entries(availableDimensionsGrouped).map(([groupKey, dims]) => {`;

const newMap = `                // If specific gems are selected, render their dropdowns
                const entries = Object.entries(availableDimensionsGrouped).sort((a, b) => {
                  const aGem = a[0].toLowerCase().startsWith("sapphire") ? "sapphire" : a[0].toLowerCase();
                  const bGem = b[0].toLowerCase().startsWith("sapphire") ? "sapphire" : b[0].toLowerCase();
                  
                  const aGemIndex = selectedGems.findIndex(g => g.toLowerCase() === aGem);
                  const bGemIndex = selectedGems.findIndex(g => g.toLowerCase() === bGem);
                  
                  if (aGemIndex !== bGemIndex && aGemIndex !== -1 && bGemIndex !== -1) {
                    return aGemIndex - bGemIndex;
                  }
                  
                  if (aGem === "sapphire" && bGem === "sapphire") {
                    const aColor = a[0].split(" ").slice(1).join(" ").toLowerCase();
                    const bColor = b[0].split(" ").slice(1).join(" ").toLowerCase();
                    const aColIndex = selectedSapphireColors.findIndex(c => c.toLowerCase() === aColor);
                    const bColIndex = selectedSapphireColors.findIndex(c => c.toLowerCase() === bColor);
                    if (aColIndex !== -1 && bColIndex !== -1) return aColIndex - bColIndex;
                  }
                  
                  return a[0].localeCompare(b[0]);
                });
                
                return entries.map(([groupKey, dims]) => {`;

content = content.replace(oldMap, newMap);
fs.writeFileSync(file, content);
console.log("Done");
