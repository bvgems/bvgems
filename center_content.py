with open('src/components/Category/CategoryContent.tsx', 'r') as f:
    content = f.read()

# Replace 1: Main container and paragraph
old_1 = """      {/* BELOW PRODUCT LISTING */}
      <div className="px-6 md:px-12 pb-10 max-w-[1200px] mx-auto w-full mt-10">
                <p className="text-gray-700 leading-relaxed mt-4">"""
new_1 = """      {/* BELOW PRODUCT LISTING */}
      <div className="px-6 md:px-12 pb-10 max-w-[1200px] mx-auto w-full mt-10 flex flex-col items-center">
                <p className="text-gray-700 leading-relaxed mt-4 text-center max-w-[800px]">"""
content = content.replace(old_1, new_1)

# Replace 2: Additional info table wrapper
old_2 = """                {/* Static Info Table */}
                <div className="mt-3 max-w-[500px]">
                  <h2 className="text-lg font-semibold mb-3">
                    Additional Information
                  </h2>"""
new_2 = """                {/* Static Info Table */}
                <div className="mt-8 max-w-[600px] w-full flex flex-col items-center">
                  <h2 className="text-xl font-semibold mb-3 text-center">
                    Additional Information
                  </h2>"""
content = content.replace(old_2, new_2)

# Replace 3: Quality Grades wrapper
old_3 = """                  <div className="mt-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-3">
                      Quality Grades
                    </h2>"""
new_3 = """                  <div className="mt-10 w-full flex flex-col items-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                      Quality Grades
                    </h2>"""
content = content.replace(old_3, new_3)

# Replace 4: Links wrapper
old_4 = """                <div>
                  <Button
                    onClick={open}
                    variant="transparent"
                    size="sm"
                    color="gray"
                    mt={10}
                  >"""
new_4 = """                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  <Button
                    onClick={open}
                    variant="transparent"
                    size="sm"
                    color="gray"
                    mt={10}
                  >"""
content = content.replace(old_4, new_4)

with open('src/components/Category/CategoryContent.tsx', 'w') as f:
    f.write(content)
