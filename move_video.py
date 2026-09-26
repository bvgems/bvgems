import re

with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# Extract the entire motion.div that wraps the video in the right column
video_motion_div_regex = r'(<motion\.div\s+initial={{ opacity: 0, y: 80 }}\s+animate={{ opacity: 1, y: 0 }}\s+transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}\s+className="flex gap-4 items-start px-4 mt-6"\s*>\s*<div className="w-full">.*?{/\*\s*Conditional Video Block.*?</div>\s*</motion\.div>)'

match = re.search(video_motion_div_regex, content, re.DOTALL)
if match:
    video_block_full = match.group(1)
    
    # Remove from right column
    content = content.replace(video_block_full, "")
    
    # We want to extract just the inner conditional block to put in the left column
    inner_block_match = re.search(r'({/\*\s*Conditional Video Block.*?}\s*\)\s*})', video_block_full, re.DOTALL)
    if inner_block_match:
        inner_block = inner_block_match.group(1)
        
        # Insert below image thumbnails in left column
        # Left column structure has:
        #                     </div>
        #
        #
        #                   </div>
        #                 ) : (
        target_str = """                    </div>


                  </div>
                ) : ("""
        
        replacement_str = "                    </div>\n\n" + inner_block + "\n\n                  </div>\n                ) : ("
        
        if target_str in content:
            content = content.replace(target_str, replacement_str)
            with open('src/components/Category/CategoryContent.tsx', 'w') as f:
                f.write(content)
            print("Successfully moved video block!")
        else:
            print("Could not find insertion target!")
    else:
        print("Could not extract inner block")
else:
    print("Could not find video block to move!")
