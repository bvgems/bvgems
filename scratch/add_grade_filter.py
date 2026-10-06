import re

with open('src/components/GridView/GridView.tsx', 'r') as f:
    code = f.read()

# 1. Add state variable
if 'const [selectedGrades, setSelectedGrades] = useState<string[]>([]);' not in code:
    code = code.replace(
        'const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // "Natural" or "Lab Grown"',
        'const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // "Natural" or "Lab Grown"\n  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);'
    )

# 2. Add to URL sync (parse from URL)
code = code.replace(
    'setSelectedTypes(parsed.selectedTypes || []);',
    'setSelectedTypes(parsed.selectedTypes || []);\n        setSelectedGrades(parsed.selectedGrades || []);'
)

# Reset grades when no URL
code = code.replace(
    'setSelectedTypes([]);\n      }',
    'setSelectedTypes([]);\n      }\n\n      setSelectedGrades([]);'
)

# 3. Add to URL sync (save to URL state object)
code = code.replace(
    '''      selectedTypes,
      weight,''',
    '''      selectedTypes,
      selectedGrades,
      weight,'''
)

# Add to sync dependencies
code = code.replace(
    '''    selectedTypes,
    weight,''',
    '''    selectedTypes,
    selectedGrades,
    weight,'''
)

# 4. Add filtering logic
filter_logic = '''    // Filter by Type (Natural / Lab Grown)
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(item => {
        const type = String(item.type || "").toLowerCase();
        return selectedTypes.some(t => type === t.toLowerCase());
      });
    }'''

new_filter_logic = filter_logic + '''

    // Filter by Grade
    if (selectedGrades.length > 0) {
      filtered = filtered.filter(item => {
        const grade = String(item.quality || "").toLowerCase();
        return selectedGrades.some(g => grade === g.toLowerCase());
      });
    }'''
code = code.replace(filter_logic, new_filter_logic)

# 5. Pass props to GridViewTopFilters
code = code.replace(
    '''          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          availableTypes={availableTypes}''',
    '''          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
          availableTypes={availableTypes}
          selectedGrades={selectedGrades}
          setSelectedGrades={setSelectedGrades}
          availableGrades={availableGrades}'''
)

with open('src/components/GridView/GridView.tsx', 'w') as f:
    f.write(code)

print("Done GridView.tsx")

