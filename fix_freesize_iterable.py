import os

file_path = "src/components/FreeSizeGemstones/FreeSizeGemstoneSelection.tsx"
with open(file_path, "r") as f:
    content = f.read()

old_state = """  const [filteredGemstones, setFilteredGemstones] = useState<any[]>(() => {
    if (!lastFreeSizeData) return [];
    return [...lastFreeSizeData].sort((a, b) => sortBySizeAsc(a, b, 'dimension'));
  });"""

new_state = """  const [filteredGemstones, setFilteredGemstones] = useState<any[]>(() => {
    if (!lastFreeSizeData?.data) return [];
    return [...lastFreeSizeData.data].sort((a, b) => sortBySizeAsc(a, b, 'dimension'));
  });"""

content = content.replace(old_state, new_state)

with open(file_path, "w") as f:
    f.write(content)
