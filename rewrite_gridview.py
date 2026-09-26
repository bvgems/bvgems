with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    content = f.read()

# We need to import MultiSelect if not imported
if 'MultiSelect' not in content:
    content = content.replace('import { NumberInput, Select, Button, ActionIcon, Collapse, Switch } from "@mantine/core";', 'import { NumberInput, Select, MultiSelect, Button, ActionIcon, Collapse, Switch } from "@mantine/core";')

# Define the mobile block
mobile_block = """
            {/* MOBILE FILTERS (Selects) */}
            <div className="flex lg:hidden flex-wrap gap-4 justify-center w-full mb-6">
              {/* Gem Type Dropdown */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Gem Type
                </span>
                <MultiSelect
                  placeholder="Any Gem Type"
                  size="md"
                  radius="md"
                  data={gemstoneOptions.map((gem: any) => ({
                    label: gem.label,
                    value: gem.value,
                  }))}
                  value={selectedGems}
                  onChange={setSelectedGems}
                  clearable
                  className="w-full"
                  renderOption={({ option }) => {
                    const gemOption = gemstoneOptions.find(g => g.value === option.value);
                    return (
                      <div className="flex items-center gap-3">
                        {gemOption && <img src={gemOption.image} alt={option.label} className="w-6 h-6 object-cover rounded-full" />}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                />
              </div>

              {/* Sapphire Colors */}
              {selectedGems.includes("Sapphire") && sapphireColors.length > 0 && (
                <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                  <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Color
                  </span>
                  <MultiSelect
                    placeholder="Any Color"
                    size="md"
                    radius="md"
                    data={sapphireColors.map((c: any) => ({
                      label: c,
                      value: c,
                    }))}
                    value={selectedSapphireColors}
                    onChange={setSelectedSapphireColors}
                    clearable
                    className="w-full"
                    renderOption={({ option }) => {
                      const colorOption = shopByColorOptions.find(o => o.name.toLowerCase() === option.value.toLowerCase());
                      return (
                        <div className="flex items-center gap-3">
                          {colorOption?.image ? (
                            <img src={colorOption.image} alt={option.label} className="w-6 h-6 object-contain mix-blend-multiply" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-gray-200" style={{ backgroundColor: colorOption?.color || '#ccc' }} />
                          )}
                          <span>{option.label}</span>
                        </div>
                      );
                    }}
                  />
                </div>
              )}

              {/* Shape Dropdown */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Shape
                </span>
                <MultiSelect
                  placeholder="Any Shape"
                  size="md"
                  radius="md"
                  data={shapeOptions.map((s: any) => ({
                    label: s.label,
                    value: s.value,
                  }))}
                  value={selectedShapes}
                  onChange={setSelectedShapes}
                  clearable
                  className="w-full"
                  renderOption={({ option }) => {
                    const shapeOption = shapeOptions.find(s => s.value === option.value);
                    return (
                      <div className="flex items-center gap-3">
                        {shapeOption && <img src={shapeOption.image} alt={option.label} className="w-5 h-5 object-contain opacity-70" />}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                />
              </div>
            </div>

            {/* DESKTOP FILTERS (Icons) */}
            <div className="hidden lg:flex flex-col lg:flex-row gap-10">
"""

# Replace the start of the desktop block
content = content.replace('<div className="flex flex-col lg:flex-row gap-10">', mobile_block)

# Add closing div for desktop filters
content = content.replace('</div>\n\n      <div className="w-full h-[1px] bg-gray-200 my-8" />', '</div>\n            </div>\n\n      <div className="w-full h-[1px] bg-gray-200 my-8" />')

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(content)

print("Done")
