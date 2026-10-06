import re

# 1. Update GridViewTopFilters.tsx
with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    filters_code = f.read()

filters_code = re.sub(r'\s*selectedGrades: string\[\];\s*setSelectedGrades: \(val: string\[\]\) => void;\s*availableGrades: string\[\];', '', filters_code)
filters_code = re.sub(r'\s*selectedGrades,\s*setSelectedGrades,\s*availableGrades,', ',', filters_code)
filters_code = filters_code.replace(' || selectedGrades.length > 0', '')
filters_code = re.sub(r'\s*\{\s*availableGrades\.length > 0 && \([\s\S]*?\)\s*\}', '', filters_code)
filters_code = re.sub(r'\s*\{selectedGrades\.map\(grade => \([\s\S]*?\}\)\)\}', '', filters_code)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(filters_code)
print("Updated GridViewTopFilters.tsx")


# 2. Update GridView.tsx
with open('src/components/GridView/GridView.tsx', 'r') as f:
    grid_code = f.read()

grid_code = re.sub(r'\s*const \[selectedGrades, setSelectedGrades\] = useState<string\[\]>\(\[\]\);', '', grid_code)

# Remove availableGrades useMemo block completely
grid_code = re.sub(r'\s*const availableGrades = useMemo\(\(\) => \{[\s\S]*?return Array\.from\(gradesSet\);\s*\}, \[searchItems, selectedGems, selectedShapes\]\);', '', grid_code)

# Remove filtering by Grades
grid_code = re.sub(r'\s*// Filter by Grade\s*if \(selectedGrades\.length > 0\) \{[\s\S]*?\}\s*\}', '', grid_code)

# Remove setSelectedGrades([])
grid_code = re.sub(r'\s*setSelectedGrades\(\[\]\);', '', grid_code)

# Remove selectedGrades from dependencies array
grid_code = grid_code.replace('selectedGrades,\n', '')

# Remove props passed to GridViewTopFilters
grid_code = re.sub(r'\s*selectedGrades=\{selectedGrades\}\s*setSelectedGrades=\{setSelectedGrades\}\s*availableGrades=\{availableGrades\}', '', grid_code)

with open('src/components/GridView/GridView.tsx', 'w') as f:
    f.write(grid_code)
print("Updated GridView.tsx")

