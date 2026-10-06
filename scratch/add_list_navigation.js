const fs = require('fs');
const file = 'src/components/GridView/GridView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('generateCalibratedStoneUrl')) {
  content = content.replace(
    'import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";',
    'import { getPerCaratPrice, getPerStonePrice } from "@/utils/priceHelpers";\nimport { generateCalibratedStoneUrl } from "@/utils/seoUrlHelpers";'
  );
}

// Add click logic
const targetTr = `<Table.Tr key={row.id || idx}>`;
const newTr = `<Table.Tr 
                        key={row.id || idx}
                        onClick={() => {
                          const stoneHandle = row?.collection_slug?.toLowerCase() || "unknown";
                          router.push(generateCalibratedStoneUrl(row, stoneHandle));
                        }}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                      >`;

content = content.replace(targetTr, newTr);

fs.writeFileSync(file, content);
console.log("Done");
