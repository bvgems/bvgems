import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Remove the line and modify the bottom filter container
target_block = '''            <div className="w-full h-[1px] bg-gray-200 my-8" />

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-center lg:items-start w-full">'''

new_block = '''            {/* Remapped bottom container */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full mt-6">
              
              {/* Left Side: Filters */}
              <div className="flex-1 flex flex-wrap gap-8 items-start w-full">'''

code = code.replace(target_block, new_block)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("First pass done")
