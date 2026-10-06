import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Remove duplicate imports
lines = code.split('\n')
seen_imports = set()
new_lines = []
for line in lines:
    if line.startswith('import { getCategoryData } from "@/apis/api";'):
        if line in seen_imports:
            continue
        seen_imports.add(line)
    new_lines.append(line)

code = '\n'.join(new_lines)

# Remove searchItems from TopFiltersProps
code = code.replace('  searchItems: any[];', '')

# Also remove it from the component props signature if it's there
code = code.replace('export const GridViewTopFilters = ({\n  searchItems,\n', 'export const GridViewTopFilters = ({\n')

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("Fixed TS errors")
