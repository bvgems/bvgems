import re

with open('src/components/GridView/GridView.tsx', 'r') as f:
    code = f.read()

# Let's add a useEffect to clear selectedGrades if it's not valid
# Find the availableTypes useEffect and add another one below it
target = '''  useEffect(() => {
    if (availableTypes.length === 1) {'''

new_logic = '''  useEffect(() => {
    if (!selectedTypes.includes("Natural") && selectedGrades.length > 0) {
      setSelectedGrades([]);
    }
  }, [selectedTypes, selectedGrades]);

  useEffect(() => {
    if (availableTypes.length === 1) {'''

code = code.replace(target, new_logic)

with open('src/components/GridView/GridView.tsx', 'w') as f:
    f.write(code)

print("Added auto-clear for grades")
