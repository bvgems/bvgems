const fs = require('fs');
const file = 'src/components/Category/CategoryTable.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Desktop Row TableTr
content = content.replace(
  /<TableTr\s+className="cursor-pointer hidden md:table-row"\s+onClick=\{\(e:\s*any\)\s*=>\s*\{\s*if\s*\(e\.target\?\.closest\?\.\('button,\s*input,\s*\[role="button"\]'\)\)\s*return;\s*goToCartPage\(element\);\s*\}\}\s*>/g,
  '<TableTr className="cursor-pointer hidden md:table-row">'
);

// 2. Desktop Row TableTds
content = content.replace(
  /<TableTd>\s*<div className="w-14/g,
  '<TableTd onClick={() => goToCartPage(element)}>\n                          <div className="w-14'
);
content = content.replace(
  /<TableTd>\{element\.type\}<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>{element.type}</TableTd>'
);
content = content.replace(
  /<TableTd className="capitalize">\s*\{element\.collection_slug\}\s*<\/TableTd>/g,
  '<TableTd className="capitalize" onClick={() => goToCartPage(element)}>\n                          {element.collection_slug}\n                        </TableTd>'
);
content = content.replace(
  /<TableTd>\s*\{element\.collection_slug === "Tanzanite"\s*\?\s*"Purplish Blue"\s*:\s*element\.color\}\s*<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>\n                          {element.collection_slug === "Tanzanite"\n                            ? "Purplish Blue"\n                            : element.color}\n                        </TableTd>'
);
content = content.replace(
  /<TableTd>\{element\.size\}<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>{element.size}</TableTd>'
);
content = content.replace(
  /<TableTd>\{element\.ct_weight\}<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>{element.ct_weight}</TableTd>'
);
content = content.replace(
  /<TableTd>\{element\.quality\}<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>{element.quality}</TableTd>'
);
content = content.replace(
  /<TableTd>\{element\.cut\}<\/TableTd>/g,
  '<TableTd onClick={() => goToCartPage(element)}>{element.cut}</TableTd>'
);

// 3. Mobile Row TableTr
content = content.replace(
  /<TableTr\s+onClick=\{\(e:\s*any\)\s*=>\s*\{\s*if\s*\(e\.target\?\.closest\?\.\('button,\s*input,\s*\[role="button"\]'\)\)\s*return;\s*goToCartPage\(element\);\s*\}\}\s*className="md:hidden"\s*>/g,
  '<TableTr className="md:hidden">'
);

// 4. Mobile Row Left div
content = content.replace(
  /\{/* Left: Image \+ details \*/\}\s*<div className="flex items-center gap-3">/g,
  '{/* Left: Image + details */}\n                            <div className="flex items-center gap-3" onClick={() => goToCartPage(element)}>'
);

fs.writeFileSync(file, content, 'utf8');
console.log("Patched successfully");
