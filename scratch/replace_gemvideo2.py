import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

gem_video_regex = re.compile(r'const GemVideo = \(\{ gem, shape, selectedTypes, selectedGrades \}: any\) => \{.*?(?=export const GridViewTopFilters =)', re.DOTALL)

new_gem_video = '''import { getCategoryData } from "@/apis/api";

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
      
      // Determine grade priorities based on selected types
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
               
               // First try to find shape AND color match
               const bestMatch = gradeItem.cloudinary_videos.find((v: any) => {
                  const lbl = (v.label || v.emerald_type || "").toLowerCase();
                  const matchesShape = lbl.includes(shapeToUse.toLowerCase());
                  const matchesColor = colorMatch ? lbl.includes(colorMatch.toLowerCase()) : true;
                  return matchesShape && matchesColor;
               });
               
               // Fallback to shape only
               const shapeMatch = bestMatch || gradeItem.cloudinary_videos.find((v: any) => 
                  (v.label || v.emerald_type || "").toLowerCase().includes(shapeToUse.toLowerCase())
               );
               
               const videoItem = shapeMatch || gradeItem.cloudinary_videos[0]; // fallback
               
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
    <div 
      className={`w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
       <div className="relative w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5">
          <video 
             key={videoUrl}
             src={videoUrl} 
             autoPlay 
             loop 
             muted 
             playsInline 
             className="w-full h-full object-cover scale-[1.02]"
             onCanPlay={() => setIsLoaded(true)}
             onError={() => setIsLoaded(false)}
          />
          {label && (
             <div className="absolute bottom-3 left-3 bg-black/20 backdrop-blur-[6px] border border-white/20 text-white text-[9px] px-2.5 py-1 rounded-full shadow-sm font-semibold uppercase tracking-widest pointer-events-none z-10">
                {label}
             </div>
          )}
       </div>
    </div>
  );
};

'''

if gem_video_regex.search(code):
    code = gem_video_regex.sub(new_gem_video, code)
    # Also pass selectedSapphireColors to GemVideo
    code = code.replace('''<GemVideo 
                gem={selectedGems.length > 0 ? selectedGems[0] : null} 
                shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
                selectedTypes={selectedTypes}
                selectedGrades={selectedGrades}
              />''', '''<GemVideo 
                gem={selectedGems.length > 0 ? selectedGems[0] : null} 
                shape={selectedShapes.length > 0 ? selectedShapes[0] : null} 
                selectedTypes={selectedTypes}
                selectedGrades={selectedGrades}
                selectedSapphireColors={selectedSapphireColors}
              />''')
    with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
        f.write(code)
    print("Replaced GemVideo again")
else:
    print("Could not find GemVideo")
