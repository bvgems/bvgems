import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

target = '''                {selectedTypes.map(type => (
                  <div key={type} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    {type}
                    <IconX size={14} className="cursor-pointer" onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))} />
                  </div>
                ))}'''

new_target = target + '''

                {selectedGrades.map(grade => (
                  <div key={grade} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                    Grade {grade}
                    <IconX size={14} className="cursor-pointer" onClick={() => setSelectedGrades(selectedGrades.filter(g => g !== grade))} />
                  </div>
                ))}'''

code = code.replace(target, new_target)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("Done GridViewTopFilters.tsx active filters")
