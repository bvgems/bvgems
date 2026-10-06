import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# 1. Single select gem
old_toggle = '''  const toggleGem = (val: string) => {
    let newSelected = [...selectedGems];
    if (selectedGems.includes(val)) {
      newSelected = newSelected.filter(g => g !== val);
      // If unselecting Sapphire, clear sapphire colors
      if (val === "Sapphire") {
        setSelectedSapphireColors([]);
      }
    } else {
      newSelected.push(val);
    }
    setSelectedGems(newSelected);
  };'''

new_toggle = '''  const toggleGem = (val: string) => {
    if (selectedGems.includes(val)) {
      setSelectedGems([]);
      if (val === "Sapphire") {
        setSelectedSapphireColors([]);
      }
    } else {
      if (selectedGems.includes("Sapphire") && val !== "Sapphire") {
        setSelectedSapphireColors([]);
      }
      setSelectedGems([val]);
    }
  };'''
code = code.replace(old_toggle, new_toggle)

# 2. Mobile gem single select
old_multi = '''                <MultiSelect
                  placeholder="Any Gem Type"
                  size="md"
                  radius="md"
                  data={gemstoneOptions.map((gem: any) => ({
                    label: gem.label,
                    value: gem.value,
                  }))}
                  value={selectedGems}
                  onChange={(val) => {
                    setSelectedGems(val);
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}'''
new_multi = '''                <Select
                  placeholder="Any Gem Type"
                  size="md"
                  radius="md"
                  data={gemstoneOptions.map((gem: any) => ({
                    label: gem.label,
                    value: gem.value,
                  }))}
                  value={selectedGems.length > 0 ? selectedGems[0] : null}
                  onChange={(val) => {
                    setSelectedGems(val ? [val] : []);
                    if (selectedGems.includes("Sapphire") && val !== "Sapphire") {
                      setSelectedSapphireColors([]);
                    }
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }}'''
code = code.replace(old_multi, new_multi)

# 3. Flat dimension dropdown
old_dims = '''              <div className="flex flex-col gap-4 w-full lg:w-auto mx-auto lg:mx-0">
                {(() => {
                if (selectedGems.length === 0) {
                  // No specific gem selected, combine all dimensions into one dropdown
                  const allDims = new Set<string>();
                  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
                  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `ANY GEM${shapeStr} DIMENSIONS`.toUpperCase();
                  
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
                
                return entries.map(([groupKey, dims]) => {
                  const isSapphire = groupKey.toLowerCase().startsWith("sapphire");
                  const baseGem = isSapphire ? "Sapphire" : groupKey;
                  // Only render if the base gem is in selectedGems
                  if (!selectedGems.some(g => baseGem.toLowerCase() === g.toLowerCase())) return null;

                  // Additionally filter by selected sapphire colors if applicable
                  if (baseGem.toLowerCase() === "sapphire") {
                     if (selectedSapphireColors.length === 0) return null;
                     const color = groupKey.split(" ").slice(1).join(" ");
                     if (!selectedSapphireColors.some(c => c.toLowerCase() === color.toLowerCase())) return null;
                  }

                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `${groupKey}${shapeStr} DIMENSIONS`.toUpperCase();
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
                })()}'''

new_dims = '''              <div className="flex flex-col gap-4 w-full lg:w-auto mx-auto lg:mx-0">
                {(() => {
                  const allDims = new Set<string>();
                  Object.values(availableDimensionsGrouped).forEach(dims => dims.forEach(d => allDims.add(d)));
                  const combinedDims = Array.from(allDims).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                  const gemStr = selectedGems.length > 0 ? ` ${selectedGems[0]}` : " ANY GEM";
                  const shapeStr = selectedShapes.length > 0 ? ` ${selectedShapes[0]}` : "";
                  const label = `${gemStr}${shapeStr} DIMENSIONS`.trim().toUpperCase();
                  
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
                })()}'''
code = code.replace(old_dims, new_dims)

# Now completely strip out Grades filter logic cleanly!
code = re.sub(r'\s*selectedGrades: string\[\];\s*setSelectedGrades: \(val: string\[\]\) => void;\s*availableGrades: string\[\];', '', code)
code = re.sub(r'\s*selectedGrades,\s*setSelectedGrades,\s*availableGrades,', ',', code)
code = code.replace(' || selectedGrades.length > 0', '')
code = re.sub(r'\s*\{\s*availableGrades\.length > 0 && \([\s\S]*?optionsList=\{availableGrades\}[\s\S]*?\/\>[\s\S]*?\}\)', '', code)
code = re.sub(r'\s*\{selectedGrades\.map\(grade => \(\s*<div key=\{grade\}[\s\S]*?setSelectedGrades\(selectedGrades\.filter\(g => g !== grade\)\)} \/\>\s*<\/div>\s*\)\)\}', '', code)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

