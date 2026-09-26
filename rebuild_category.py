import re

with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# I will recreate the layout from the point of return (
return_idx = content.find('  return (\n    <>')
if return_idx == -1:
    print("Could not find return")
    exit(1)

# Extract pieces using specific regexes on the entire file.

# 1. Breadcrumbs
breadcrumbs_match = re.search(r'<Breadcrumbs[\s\S]*?</Breadcrumbs>', content)
breadcrumbs = breadcrumbs_match.group(0)

# 2. Heading
heading_match = re.search(r'<h1 className="text-\[1\.5rem\] font-bold tracking-wide">[\s\S]*?</h1>', content)
heading = heading_match.group(0)

# 3. Badges
badges_match = re.search(r'<div className="flex justify-end gap-2 mt-2">[\s\S]*?</div>', content)
badges = badges_match.group(0).replace('justify-end', 'justify-start')

# 4. Image Carousel
image_carousel_match = re.search(r'\{/\* Main Carousel \(Images Only\) \*/\}[\s\S]*?</Carousel>', content)
image_carousel = image_carousel_match.group(0)

# 5. Thumbnails
thumbnails_match = re.search(r'\{/\* Thumbnails \(Images Only\) \*/\}[\s\S]*?</div>\s*</div>', content)
thumbnails = thumbnails_match.group(0)

# 6. Video Block
video_match = re.search(r'\{selectedGradeVideos\.length > 0 && currentVideoUrl && \([\s\S]*?\)\s*\}', content)
video_block = video_match.group(0)

# 7. Category Table
category_table_match = re.search(r'<CategoryTable[\s\S]*?/>', content)
category_table = category_table_match.group(0)

# 8. Extra Descriptions (EmeraldDetails, Lab Pariba, Lab Alexandrite, Natural Blue Sapphire Shade Variations)
# It starts at <EmeraldDetails and ends at ) : null} (line 757)
extra_desc_match = re.search(r'<EmeraldDetails[\s\S]*?\) : null\s*\)\s*:\s*null\}', content)
if extra_desc_match:
    extra_desc = extra_desc_match.group(0)
else:
    extra_desc = "{/* Could not find extra descriptions */}"

# 9. Text Block (Paragraph, Static Info, Quality Grades, Buttons)
text_block_match = re.search(r'<p className="text-gray-700 leading-relaxed mt-4">[\s\S]*?Learn More About \{data\?\.title\}[\s\S]*?</Button>\s*</div>', content)
text_block = text_block_match.group(0)

# 10. Size Tolerance Guide and Script
script_match = re.search(r'<SizeToleranceGuide[\s\S]*?/>\s*<Script[\s\S]*?/>', content)
script_block = script_match.group(0)

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

layout = f"""  return (
    <>
      <div className="mt-9 px-6">
        {breadcrumbs}
        
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
              {heading}
              {badges}
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
                    {thumbnails}
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
          {extra_desc}
        </div>
      </div>

      {script_block}
    </>
  );
}}
"""

new_content = content[:return_idx] + layout

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(new_content)

print("Done rebuilding!")
