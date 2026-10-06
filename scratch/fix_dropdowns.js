const fs = require('fs');
const file = 'src/components/GridView/GridViewTopFilters.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldRender = `              {Object.keys(availableDimensionsGrouped).length > 0 ? (
                Object.entries(availableDimensionsGrouped).map(([groupKey, dims]) => {
                  const shapeStr = selectedShapes.length > 0 ? \` \${selectedShapes[0]}\` : "";
                  const label = \`\${groupKey}\${shapeStr} Dimensions (MM)\`.toUpperCase();
                  return (
                    <MultiDropdownFilter 
                      key={groupKey}
                      label={label} 
                      value={selectedDimensions[groupKey] || []} 
                      onChange={(val) => {
                        setSelectedDimensions(prev => ({ ...prev, [groupKey]: val }));
                      }} 
                      optionsList={dims} 
                    />
                  );
                })
              ) : (
                <MultiDropdownFilter 
                  label="DIMENSIONS (MM)" 
                  value={[]} 
                  onChange={() => {}} 
                  optionsList={[]} 
                />
              )}`;

const newRender = `              {(() => {
                if (selectedGems.length === 0) {
                  // No specific gem selected, combine all dimensions into one dropdown
                  const allDims = new Set<string>();
                  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
                  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const shapeStr = selectedShapes.length > 0 ? \` \${selectedShapes[0]}\` : "";
                  const label = \`ANY GEM\${shapeStr} DIMENSIONS (MM)\`.toUpperCase();
                  
                  return (
                    <MultiDropdownFilter 
                      label={label} 
                      value={selectedDimensions["Any"] || []} 
                      onChange={(val) => {
                        setSelectedDimensions(prev => ({ ...prev, "Any": val }));
                      }} 
                      optionsList={combinedDims} 
                    />
                  );
                }

                // If specific gems are selected, render their dropdowns
                return Object.entries(availableDimensionsGrouped).map(([groupKey, dims]) => {
                  const baseGem = groupKey.split(" ")[0]; // e.g. "Sapphire" or "Aquamarine"
                  // Only render if the base gem is in selectedGems
                  if (!selectedGems.some(g => baseGem.toLowerCase() === g.toLowerCase())) return null;

                  // Additionally filter by selected sapphire colors if applicable
                  if (baseGem.toLowerCase() === "sapphire" && selectedSapphireColors.length > 0) {
                     const color = groupKey.split(" ").slice(1).join(" ");
                     if (!selectedSapphireColors.some(c => c.toLowerCase() === color.toLowerCase())) return null;
                  }

                  const shapeStr = selectedShapes.length > 0 ? \` \${selectedShapes[0]}\` : "";
                  const label = \`\${groupKey}\${shapeStr} DIMENSIONS (MM)\`.toUpperCase();
                  return (
                    <MultiDropdownFilter 
                      key={groupKey}
                      label={label} 
                      value={selectedDimensions[groupKey] || []} 
                      onChange={(val) => {
                        setSelectedDimensions(prev => ({ ...prev, [groupKey]: val }));
                      }} 
                      optionsList={dims} 
                    />
                  );
                });
              })()}`;

content = content.replace(oldRender, newRender);

// Also need to update the filtering in GridView to support "Any" key!
fs.writeFileSync(file, content);
console.log("Done");
