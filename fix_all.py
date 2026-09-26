import re

with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# 1. Replace Filter Bar
old_filter_bar = re.search(r'<Container size="xl" className="mb-10 mx-auto px-0">[\s\S]*?</Container>', content)

new_filter_bar = """<Container size="xl" className="mx-auto px-0 mb-0 md:mb-10">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              
              {/* Sapphire Color */}
              {isSapphire && (
                <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                  <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                    Color
                  </span>
                  <Select
                    size="md"
                    radius="md"
                    scrollAreaProps={{ type: "scroll" }}
                    data={SapphireLooseGemstoneColorOptions.map((c: any) => ({
                      label: c.value,
                      value: c.value,
                    }))}
                    value={selectedSapphireColor}
                    onChange={(val) => setSelectedSapphireColor(val!)}
                    renderOption={({ option }) => {
                      const colorOption = SapphireLooseGemstoneColorOptions.find(c => c.value === option.value);
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
                    leftSectionPointerEvents="none"
                    leftSection={
                      (() => {
                        const colorOption = SapphireLooseGemstoneColorOptions.find(c => c.value === selectedSapphireColor);
                        if (!colorOption) return null;
                        return colorOption.image ? (
                          <img src={colorOption.image} alt={colorOption.value} className="w-5 h-5 object-contain mix-blend-multiply" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: colorOption.color || '#ccc' }} />
                        );
                      })()
                    }
                    className="w-full"
                  />
                </div>
              )}

              {/* Shape */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Shape
                </span>
                <Select
                  placeholder="Any Shape"
                  size="md"
                  radius="md"
                  scrollAreaProps={{ type: "scroll" }}
                  data={sortedShapes.map((shape: string) => ({
                    label: shape,
                    value: shape,
                  }))}
                  value={selectedShape || null}
                  onChange={(val) => setSelectedShape(val)}
                  renderOption={({ option }) => {
                    const shapeImageMap: Record<string, string> = {
                      Round: "/assets/round.svg",
                      Oval: "/assets/oval.svg",
                      "Emerald Cut": "/assets/emerald.svg",
                      Pear: "/assets/pear.svg",
                      "Princess Cut": "/assets/princesscut.svg",
                      Marquise: "/assets/marquise.svg",
                      Heart: "/assets/heart.svg",
                      "Straight Baguette": "/assets/baguette.svg",
                      Cushion: "/assets/cushion.svg",
                      Trillion: "/assets/trillion.svg",
                    };
                    return (
                      <div className="flex items-center gap-3">
                        {shapeImageMap[option.value] ? (
                          <img src={shapeImageMap[option.value]} alt={option.label} className="w-5 h-5 object-contain opacity-70" />
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                        <span>{option.label}</span>
                      </div>
                    );
                  }}
                  leftSectionPointerEvents="none"
                  leftSection={
                    (() => {
                      if (!selectedShape) return null;
                      const shapeImageMap: Record<string, string> = {
                        Round: "/assets/round.svg",
                        Oval: "/assets/oval.svg",
                        "Emerald Cut": "/assets/emerald.svg",
                        Pear: "/assets/pear.svg",
                        "Princess Cut": "/assets/princesscut.svg",
                        Marquise: "/assets/marquise.svg",
                        Heart: "/assets/heart.svg",
                        "Straight Baguette": "/assets/baguette.svg",
                        Cushion: "/assets/cushion.svg",
                        Trillion: "/assets/trillion.svg",
                      };
                      return shapeImageMap[selectedShape] ? (
                        <img src={shapeImageMap[selectedShape]} alt={selectedShape} className="w-5 h-5 object-contain opacity-70" />
                      ) : null;
                    })()
                  }
                  className="w-full"
                />
              </div>

              {/* Size */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Size (mm)
                </span>
                <Select
                  placeholder="Any Size"
                  size="md"
                  radius="md"
                  scrollAreaProps={{ type: "scroll" }}
                  data={allSizes[selectedShape || ""]?.map((size: string) => ({
                    label: size.includes("x") ? size.replace(/x/g, " x ").replace(/\s+/g, " ").trim() : parseFloat(size).toFixed(2),
                    value: size,
                  })) || []}
                  value={selectedSizes[0] || null}
                  onChange={(val) => setSelectedSizes(val ? [val] : [])}
                  searchable
                  clearable
                  className="w-full"
                />
              </div>

              {/* Type */}
              <div className="flex flex-col flex-1 min-w-[150px] max-w-[250px]">
                <span className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                  Natural / Lab
                </span>
                <Select
                  placeholder="Any Type"
                  size="md"
                  radius="md"
                  scrollAreaProps={{ type: "scroll" }}
                  data={[
                    { label: "All Types", value: "" },
                    { label: "Natural", value: "Natural" },
                    { label: "Lab Grown", value: "Lab Grown" },
                  ]}
                  value={typeFilter || ""}
                  onChange={(val) => {
                    setTypeFilter(val);
                    if (val !== "Lab Grown") {
                      setEmeraldShade(null);
                    }
                  }}
                  clearable
                  className="w-full"
                />
              </div>

            </div>
          </div>
        </Container>"""

if old_filter_bar:
    content = content.replace(old_filter_bar.group(0), new_filter_bar)
else:
    print("Could not find old filter bar!")
    
with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(content)
print("done filter bar")
