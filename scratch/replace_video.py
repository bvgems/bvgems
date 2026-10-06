import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Make sure to import useState, useEffect, useRef if not already
if 'useRef' not in code:
    code = code.replace('import { useState } from "react";', 'import { useState, useEffect, useRef } from "react";')
if 'useEffect' not in code:
    code = code.replace('import { useState, useRef } from "react";', 'import { useState, useEffect, useRef } from "react";')

# Define the GemVideo component right before GridViewTopFilters export
gem_video_component = '''
const GemVideo = ({ gem, shape, selectedTypes, selectedGrades }: any) => {
  const [urlsToTry, setUrlsToTry] = useState<string[]>([]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setCurrentUrlIndex(0);
    
    if (!gem) {
      setUrlsToTry([]);
      return;
    }

    const s = shape ? shape.toLowerCase() : 'round';
    const g = gem.toLowerCase();

    const urls = [];
    
    // Exact matches
    if (selectedTypes.includes('Natural') && selectedGrades.length > 0) {
      urls.push(`/assets/videos/${g}-${s}-natural-${selectedGrades[0].toLowerCase()}.mp4`);
    } else if (selectedTypes.includes('Lab Grown')) {
      urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    }
    
    if (selectedTypes.includes('Natural')) {
      urls.push(`/assets/videos/${g}-${s}-natural.mp4`);
    } else if (selectedTypes.includes('Lab Grown')) {
      urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    }
    
    // Fallbacks
    urls.push(`/assets/videos/${g}-${s}.mp4`);
    urls.push(`/assets/videos/${g}-${s}-natural.mp4`);
    urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    urls.push(`/assets/videos/${g}-round.mp4`);

    const uniqueUrls = Array.from(new Set(urls));
    setUrlsToTry(uniqueUrls);
  }, [gem, shape, selectedTypes, selectedGrades]);

  if (urlsToTry.length === 0 || currentUrlIndex >= urlsToTry.length) {
    return null;
  }

  const currentUrl = urlsToTry[currentUrlIndex];

  return (
    <div 
      className={`w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
       <div className="w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5">
          <video 
             key={currentUrl}
             src={currentUrl} 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="w-full h-full object-cover scale-[1.02]"
             onLoadedData={() => setIsLoaded(true)}
             onError={() => {
               setIsLoaded(false);
               setCurrentUrlIndex(prev => prev + 1);
             }}
          />
       </div>
    </div>
  );
};

export const GridViewTopFilters = ({
'''

code = code.replace('export const GridViewTopFilters = ({', gem_video_component)


# Now replace the inline video block with the component call
target_video_block = '''              {/* Right Side: Video Block */}
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
              })()}'''

new_video_block = '''              {/* Right Side: Smart Video Block */}
              <GemVideo 
                gem={selectedGems.length > 0 ? selectedGems[0] : null} 
                shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
                selectedTypes={selectedTypes}
                selectedGrades={selectedGrades}
              />'''

code = code.replace(target_video_block, new_video_block)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)

print("Replaced video block with smart GemVideo component")
