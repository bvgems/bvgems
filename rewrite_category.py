import re

with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# We know the content from line 777 to 1114 needs to be replaced.
# Let's find exactly `<Grid>` after `{/* --- MOVED FILTER BAR END --- */}`.
start_marker = "{/* --- MOVED FILTER BAR END --- */}"
end_marker = "      <SizeToleranceGuide opened={opened} close={close} />"

start_idx = content.find(start_marker)
if start_idx == -1:
    print("Start marker not found")
    exit(1)

end_idx = content.find(end_marker)
if end_idx == -1:
    print("End marker not found")
    exit(1)

# Extract pieces to reuse
old_section = content[start_idx:end_idx]

# Extract Image Carousel
# From `<Carousel` to `</Carousel>` (the main one)
image_carousel_match = re.search(r'<Carousel\s+withIndicators[\s\S]*?</Carousel>', old_section)
image_carousel = image_carousel_match.group(0)

# Extract Thumbnails
thumbnails_match = re.search(r'{/\* Thumbnails \(Images Only\) \*/}[\s\S]*?</div>\s*</div>', old_section)
thumbnails = thumbnails_match.group(0)

# Extract Video Block
video_match = re.search(r'{selectedGradeVideos\.length > 0 && currentVideoUrl && \([\s\S]*?\)\s*}', old_section)
video_block = video_match.group(0)

# Extract Heading
heading_match = re.search(r'<h1 className="text-\[1\.5rem\] font-bold tracking-wide">[\s\S]*?</h1>', old_section)
heading = heading_match.group(0)

# Extract Badges
badges_match = re.search(r'<div className="flex justify-end gap-2 mt-2">[\s\S]*?</div>', old_section)
badges = badges_match.group(0).replace('justify-end', 'justify-start')

# Extract Text Block (from `<p className="text-gray-700 leading-relaxed mt-4">` to `</div>` before `<CategoryTable`)
text_block_start = old_section.find('<p className="text-gray-700 leading-relaxed mt-4">')
text_block_end = old_section.find('</div>\n              </div>\n            </motion.div>\n          </GridCol>\n        </Grid>')
text_block = old_section[text_block_start:text_block_end]

category_table_match = re.search(r'{/\* TABLE \*/}[\s\S]*?/>', old_section)
category_table = category_table_match.group(0)


new_section = f"""{start_marker}

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

      {category_table}

      <div className="px-6 md:px-12 pb-10 max-w-[1200px] mx-auto w-full">
        {text_block}
        
        <div className="mt-8">
          {{extraDescriptions}}
        </div>
      </div>

"""

new_content = content[:start_idx] + new_section + content[end_idx:]

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(new_content)

print("Successfully refactored layout!")
