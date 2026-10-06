const fs = require('fs');
const file = 'src/components/GridView/GridView.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldFilter = `    // Filter by Dimensions
    if (Object.keys(selectedDimensions).length > 0) {
      filtered = filtered.filter(item => {
        let groupKey = item.collection_slug || "";
        if (groupKey.toLowerCase() === "sapphire" && item.color) {
          groupKey = \`Sapphire \${item.color}\`;
        }
        
        const selectedForGroup = selectedDimensions[groupKey];
        if (!selectedForGroup || selectedForGroup.length === 0) {
           return true;
        }

        return selectedForGroup.includes(item.size);
      });
    }`;

const newFilter = `    // Filter by Dimensions
    if (Object.keys(selectedDimensions).length > 0) {
      filtered = filtered.filter(item => {
        if (selectedDimensions["Any"] && selectedDimensions["Any"].length > 0) {
           return selectedDimensions["Any"].includes(item.size);
        }

        let groupKey = item.collection_slug || "";
        if (groupKey.toLowerCase() === "sapphire" && item.color) {
          groupKey = \`Sapphire \${item.color}\`;
        }
        
        const selectedForGroup = selectedDimensions[groupKey];
        if (!selectedForGroup || selectedForGroup.length === 0) {
           return true;
        }

        return selectedForGroup.includes(item.size);
      });
    }`;

content = content.replace(oldFilter, newFilter);
fs.writeFileSync(file, content);
console.log("Done");
