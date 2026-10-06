import re

with open('src/components/GridView/GridView.tsx', 'r') as f:
    code = f.read()

# Fix the broken selectedTypes declaration
code = code.replace(
    '''const [selectedTypes,
    selectedGrades, setSelectedTypes] = useState<string[]>([]); // "Natural" or "Lab Grown"
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);''',
    '''const [selectedTypes, setSelectedTypes] = useState<string[]>([]); // "Natural" or "Lab Grown"
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);'''
)

# Wait, the duplicate property in object literal:
# src/components/GridView/GridView.tsx:332:7 - error TS1117: An object literal cannot have multiple properties with the same name.
# Let's check lines around 332
code = code.replace(
    '''      selectedTypes,
    selectedGrades,
      selectedGrades,''',
    '''      selectedTypes,
      selectedGrades,'''
)

code = code.replace(
    '''    selectedTypes,
    selectedGrades,
    selectedGrades,''',
    '''    selectedTypes,
    selectedGrades,'''
)

with open('src/components/GridView/GridView.tsx', 'w') as f:
    f.write(code)

print("Fixed GridView.tsx")

