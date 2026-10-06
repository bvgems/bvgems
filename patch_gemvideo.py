import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    content = f.read()

# 1. Replace the GemVideo implementation
old_gem_video_start = content.find("const GemVideo = ({ gem, shape, selectedTypes, selectedGrades, selectedSapphireColors }: any) => {")
old_gem_video_end = content.find("export const GridViewTopFilters")

new_gem_video = """
const GemVideo = ({ gem, shape, selectedTypes, selectedGrades, selectedSapphireColors }: any) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoaded(false);
    
    if (!gem) {
      setVideoUrl(null);
      return;
    }

    getCategoryData(gem.toLowerCase()).then((data) => {
      if (!active) return;
      
      const images = data?.availableQualityImages;
      if (!images || images.length === 0) {
        setVideoUrl(null);
        return;
      }
      
      const shapeToUse = shape || "Round";
      const isSapphire = gem.toLowerCase() === "sapphire";
      const colorMatch = (isSapphire && selectedSapphireColors && selectedSapphireColors.length > 0) ? selectedSapphireColors[0] : null;
      
      let gradePriorities = ["AA", "A", "B", "Lab Grown"];
      if (selectedTypes.includes("Lab Grown") && !selectedTypes.includes("Natural")) {
         gradePriorities = ["Lab Grown"];
      } else if (selectedTypes.includes("Natural") && !selectedTypes.includes("Lab Grown")) {
         gradePriorities = ["AA", "A", "B"];
      }

      let foundVideo = null;
      let foundLabel = null;

      for (const grade of gradePriorities) {
          const gradeItem = images.find((item: any) => item.quality === grade);
          if (gradeItem?.cloudinary_videos && Array.isArray(gradeItem.cloudinary_videos) && gradeItem.cloudinary_videos.length > 0) {
               
               const bestMatch = gradeItem.cloudinary_videos.find((v: any) => {
                  const lbl = (v.label || v.emerald_type || "").toLowerCase();
                  const matchesShape = lbl.includes(shapeToUse.toLowerCase());
                  const matchesColor = colorMatch ? lbl.includes(colorMatch.toLowerCase()) : true;
                  return matchesShape && matchesColor;
               });
               
               const shapeMatch = bestMatch || gradeItem.cloudinary_videos.find((v: any) => 
                  (v.label || v.emerald_type || "").toLowerCase().includes(shapeToUse.toLowerCase())
               );
               
               const videoItem = shapeMatch || gradeItem.cloudinary_videos[0];
               
               if (videoItem?.video_url) {
                   foundVideo = videoItem.video_url;
                   foundLabel = videoItem.label || videoItem.emerald_type || grade;
                   break;
               }
          }
      }
      
      setVideoUrl(foundVideo);
      setLabel(foundLabel);
    }).catch(() => {
       if (active) setVideoUrl(null);
    });

    return () => { active = false; };
  }, [gem, shape, selectedTypes, selectedGrades, selectedSapphireColors]);

  if (!videoUrl) return null;

  return (
    <div className={`w-full mt-10 mb-2 flex justify-center items-center transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ display: isLoaded ? 'flex' : 'none' }}>
      <div className="relative group overflow-hidden bg-white/50 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] border border-black/[0.03] p-2 ring-1 ring-black/[0.02]">
        <div className="relative w-full max-w-sm aspect-square md:w-[400px] md:h-[400px] rounded-[2rem] overflow-hidden bg-[#fbfbfd]">
          <video 
             key={videoUrl}
             src={videoUrl} 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
             onCanPlay={() => setIsLoaded(true)}
             onError={() => setIsLoaded(false)}
          />
          {/* Subtle elegant gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          
          {/* Elegant frosted label */}
          {label && (
             <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
               <div className="bg-white/30 backdrop-blur-xl border border-white/40 text-gray-900 px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                 <span className="text-[11px] font-medium tracking-[0.15em] uppercase drop-shadow-sm mix-blend-color-burn">
                   {label}
                 </span>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

"""
content = content[:old_gem_video_start] + new_gem_video + content[old_gem_video_end:]

# 2. Move the GemVideo component call to right below SHAPE
old_gem_video_call = """              {/* Right Side: Smart Video Block */}
              <GemVideo 
                gem={selectedGems.length > 0 ? selectedGems[0] : null} 
                shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
                selectedTypes={selectedTypes}
                selectedGrades={selectedGrades}
                selectedSapphireColors={selectedSapphireColors}
              />"""
content = content.replace(old_gem_video_call, "")

shape_end_marker = "</div>\n              </div>\n\n            </div>"
shape_replacement = """</div>\n              </div>\n\n            </div>
            
            {/* Elegant Gem Video Presentation */}
            <GemVideo 
              gem={selectedGems.length > 0 ? selectedGems[0] : null} 
              shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
              selectedTypes={selectedTypes}
              selectedGrades={selectedGrades}
              selectedSapphireColors={selectedSapphireColors}
            />"""
content = content.replace(shape_end_marker, shape_replacement)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(content)

