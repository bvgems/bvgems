import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

target_end_of_filters = '''              {selectedTypes.includes("Natural") && availableGrades.length > 0 && (
                <SingleDropdownFilter 
                  label="Grade" 
                  value={selectedGrades.length > 0 ? selectedGrades[0] : ""} 
                  onChange={(val) => setSelectedGrades(val ? [val] : [])} 
                  optionsList={availableGrades} 
                />
              )}
            </div>'''

new_end = '''              {selectedTypes.includes("Natural") && availableGrades.length > 0 && (
                <SingleDropdownFilter 
                  label="Grade" 
                  value={selectedGrades.length > 0 ? selectedGrades[0] : ""} 
                  onChange={(val) => setSelectedGrades(val ? [val] : [])} 
                  optionsList={availableGrades} 
                />
              )}
              </div>

              {/* Right Side: Video Block */}
              {(() => {
                  const selGem = selectedGems.length > 0 ? selectedGems[0] : null;
                  const selShape = selectedShapes.length > 0 ? selectedShapes[0] : null;
                  
                  let videoUrl = null;
                  if (selGem && selShape) {
                    videoUrl = `/assets/videos/${selGem.toLowerCase()}-${selShape.toLowerCase()}.mp4`;
                  } else if (selGem && !selShape) {
                    videoUrl = `/assets/videos/${selGem.toLowerCase()}-round.mp4`;
                  }
                  
                  if (!videoUrl) return null;
                  
                  return (
                    <div className="w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto">
                       <div className="w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5 transition-opacity duration-300">
                          <video 
                             src={videoUrl} 
                             autoPlay 
                             loop 
                             muted 
                             playsInline 
                             className="w-full h-full object-cover scale-[1.02]"
                             onError={(e) => {
                               const parent = e.currentTarget.parentElement;
                               if (parent) {
                                  parent.style.display = 'none';
                               }
                             }}
                          />
                       </div>
                    </div>
                  );
              })()}
            </div>'''

code = code.replace(target_end_of_filters, new_end)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("Video block added")
