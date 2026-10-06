import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Add to type TopFiltersProps
code = code.replace(
    '''  selectedTypes: string[];
  setSelectedTypes: (val: string[]) => void;
  availableTypes: string[];''',
    '''  selectedTypes: string[];
  setSelectedTypes: (val: string[]) => void;
  availableTypes: string[];

  selectedGrades: string[];
  setSelectedGrades: (val: string[]) => void;
  availableGrades: string[];'''
)

# Add to component props
code = code.replace(
    '''  selectedTypes,
  setSelectedTypes,
  availableTypes,
  resetAll''',
    '''  selectedTypes,
  setSelectedTypes,
  availableTypes,
  selectedGrades,
  setSelectedGrades,
  availableGrades,
  resetAll'''
)

# Render the filter dynamically if Natural is selected
target_filter = '''              {availableTypes.length > 0 && (
                <SingleDropdownFilter 
                  label="Type" 
                  value={selectedTypes.length > 0 ? selectedTypes[0] : ""} 
                  onChange={(val) => setSelectedTypes(val ? [val] : [])} 
                  optionsList={availableTypes} 
                />
              )}'''

new_filter = target_filter + '''

              {selectedTypes.includes("Natural") && availableGrades.length > 0 && (
                <SingleDropdownFilter 
                  label="Grade" 
                  value={selectedGrades.length > 0 ? selectedGrades[0] : ""} 
                  onChange={(val) => setSelectedGrades(val ? [val] : [])} 
                  optionsList={availableGrades} 
                />
              )}'''

code = code.replace(target_filter, new_filter)

# Also clear selectedGrades on resetAll, wait, resetAll is passed down from GridView... no, it's defined in GridView!
# Wait, let me check where resetAll is defined. In GridView.tsx.

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("Done GridViewTopFilters.tsx")
