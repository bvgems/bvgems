with open('/tmp/CategoryContent.tsx.backup', 'r') as f:
    lines = f.readlines()

def get_lines(start, end):
    return "".join(lines[start-1:end])

breadcrumbs = get_lines(420, 424)

# We know the top filter bar code
new_filter_bar = """
        {/* --- MOVED FILTER BAR START --- */}
        <Container size="xl" className="mx-auto px-0 mb-0 md:mb-10">
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
        </Container>
        {/* --- MOVED FILTER BAR END --- */}
"""

heading_and_badges = get_lines(767, 781).replace('justify-end', 'justify-start')
image_carousel = get_lines(437, 498)
video_block = get_lines(499, 573)
extra_descriptions = get_lines(582, 757)
text_block = get_lines(903, 1017) # Ends at </div>
pre_grid = get_lines(1, 424)
category_table = get_lines(1142, 1147)
post_table = get_lines(1148, len(lines))

final_content = pre_grid + f"""

{new_filter_bar}

        <Grid className="mt-6">
          {{/* Left: Heading + Image + Carousel */}}
          <GridCol span={{{{ base: 12, md: 6 }}}}>
            <motion.div
              initial={{{{ opacity: 0, y: 80 }}}}
              animate={{{{ opacity: 1, y: 0 }}}}
              transition={{{{ duration: 0.7, ease: "easeOut", delay: 0.1 }}}}
              className="px-4 md:px-12 mb-6"
            >
{heading_and_badges}
            </motion.div>

            <motion.div
              initial={{{{ opacity: 0, y: 80 }}}}
              animate={{{{ opacity: 1, y: 0 }}}}
              transition={{{{ duration: 0.7, ease: "easeOut", delay: 0.2 }}}}
              className="flex gap-4 items-start px-4 md:px-12"
            >
              <div className="w-full">
                {{availableQualityImages.length > 0 ? (
                  <div className="flex flex-col items-center">
{image_carousel}
                  </div>
                ) : (
                  <div className="h-[300px] md:h-[450px] w-full flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg">
                    <span className="text-gray-400 font-medium tracking-wide text-sm">Image Not Available</span>
                  </div>
                )}}
              </div>
            </motion.div>
          </GridCol>

          {{/* Right: Video */}}
          <GridCol span={{{{ base: 12, md: 6 }}}}>
            <motion.div
              initial={{{{ opacity: 0, y: 80 }}}}
              animate={{{{ opacity: 1, y: 0 }}}}
              transition={{{{ duration: 0.7, ease: "easeOut", delay: 0.3 }}}}
              className="flex gap-4 items-start px-4 md:px-12 mt-6 md:mt-[100px]"
            >
              <div className="w-full">
{video_block}
              </div>
            </motion.div>
          </GridCol>
        </Grid>
      </div>

      {{/* TABLE */}}
{category_table}

      {{/* BELOW PRODUCT LISTING */}}
      <div className="px-6 md:px-12 pb-10 max-w-[1200px] mx-auto w-full mt-10">
{text_block}
        
        <div className="mt-8">
{extra_descriptions}
        </div>
      </div>
""" + post_table

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(final_content)

print("BUILT")
