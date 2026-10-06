import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Extract GemVideo implementation to replace it
gem_video_regex = re.compile(r'const GemVideo = \(\{ gem, shape, selectedTypes, selectedGrades \}: any\) => \{.*?(?=export const GridViewTopFilters =)', re.DOTALL)

new_gem_video = '''import { getCategoryData } from "@/apis/api";

const GemVideo = ({ gem, shape, selectedTypes, selectedGrades }: any) => {
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
               // Try to find a video matching the shape
               const shapeMatch = gradeItem.cloudinary_videos.find((v: any) => 
                  (v.label || v.emerald_type || "").toLowerCase().includes(shapeToUse.toLowerCase())
               );
               
               const videoItem = shapeMatch || gradeItem.cloudinary_videos[0]; // fallback to first video in that grade
               
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
  }, [gem, shape, selectedTypes, selectedGrades]);

  if (!videoUrl) return null;

  return (
    <div 
      className={`w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto transition-opacity duration-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ display: isLoaded ? 'flex' : 'none' }}
    >
       <div className="relative w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5">
          <video 
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
    # Check if getCategoryData is imported
    if "import { getCategoryData } from" not in code:
        code = code.replace('import { shopByColorOptions } from "@/utils/constants";', 'import { shopByColorOptions } from "@/utils/constants";\nimport { getCategoryData } from "@/apis/api";')
    with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
        f.write(code)
    print("Replaced GemVideo")
else:
    print("Could not find GemVideo")
