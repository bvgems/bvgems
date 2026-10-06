with open('src/components/GridView/GridView.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "if (selectedGrades.length > 0) {" in line:
        skip = True
    
    if skip and "return selectedGrades.includes(quality);" in line:
        pass # Still skipping
    
    if not skip:
        new_lines.append(line)
        
    if skip and line.strip() == "}" and "return selectedGrades" not in "".join(lines):
        # We can just skip exactly 6 lines
        pass
        
with open('src/components/GridView/GridView.tsx', 'w') as f:
    # Simpler: just replace by string
    content = "".join(lines)
    content = content.replace('''    // Filter by Grade
    if (selectedGrades.length > 0) {
      filtered = filtered.filter(item => {
        const quality = item.quality || "";
        return selectedGrades.includes(quality);
      });
    }''', '')
    f.write(content)

print("Removed block!")
