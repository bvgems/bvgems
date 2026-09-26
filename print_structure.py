import re
with open('/tmp/CategoryContent.tsx.backup', 'r') as f:
    content = f.read()

def print_match(name, regex):
    m = re.search(regex, content)
    if m:
        start = content[:m.start()].count('\n') + 1
        end = content[:m.end()].count('\n') + 1
        print(f"{name}: lines {start} to {end}")

print_match("Breadcrumbs", r'<Breadcrumbs')
print_match("Grid", r'<Grid>')
print_match("GridCol Left", r'<GridCol span=\{\{\s*base:\s*12,\s*md:\s*6\s*\}\}>')
print_match("Image Carousel", r'\{/\* Main Carousel')
print_match("Video Block", r'\{selectedGradeVideos\.length > 0')
print_match("Extra Descriptions (Left)", r'<EmeraldDetails')
print_match("GridCol Right", r'<GridCol span=\{\{\s*base:\s*12,\s*md:\s*6\s*\}\}>.*?(?=<h1)')
print_match("Heading", r'<h1')
print_match("Inline Filters (Shape)", r'sortedShapes\?.map')
print_match("Paragraph", r'<p className="text-gray-700 leading-relaxed')
print_match("Info Table", r'Additional Information')
print_match("Buttons", r'See Size Tolerance Guide')
print_match("FILTER BAR (Bottom)", r'\{/\* FILTER BAR \*/\}')
print_match("CategoryTable", r'<CategoryTable')
