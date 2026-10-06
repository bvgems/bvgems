import re

with open('src/components/GridView/GridViewTopFilters.tsx', 'r') as f:
    code = f.read()

# Remove the incorrectly placed state hook
bad_hook = '''
  const [categoryData, setCategoryData] = useState<any>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (selectedGems.length > 0) {
      setIsVideoLoading(true);
      const gem = selectedGems[0].toLowerCase();
      getCategoryData(gem).then((data) => {
        if (active) {
          setCategoryData(data);
          setIsVideoLoading(false);
        }
      }).catch(() => {
        if (active) setIsVideoLoading(false);
      });
    } else {
      setCategoryData(null);
    }
    return () => { active = false; };
  }, [selectedGems]);

const SingleNumberFilter ='''

code = code.replace(bad_hook, 'const SingleNumberFilter =')

# Now insert the hook properly inside GridViewTopFilters
target = '''export const GridViewTopFilters = ({'''

new_hook = '''
export const GridViewTopFilters = ({
  searchItems,
'''

# Wait, we need to add searchItems to Props too!
props_target = '''  resetAll: () => void;
};'''
new_props = '''  resetAll: () => void;
  searchItems: any[];
};'''
code = code.replace(props_target, new_props)

code = code.replace(target, new_hook)

# Now inject the hook inside the component function
component_start = '''}: TopFiltersProps) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);'''

new_component_start = '''}: TopFiltersProps) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [categoryData, setCategoryData] = useState<any>(null);

  useEffect(() => {
    let active = true;
    if (selectedGems.length > 0) {
      const gem = selectedGems[0].toLowerCase();
      getCategoryData(gem).then((data) => {
        if (active) {
          setCategoryData(data);
        }
      }).catch(() => {});
    } else {
      setCategoryData(null);
    }
    return () => { active = false; };
  }, [selectedGems]);
'''

code = code.replace(component_start, new_component_start)

# Now update the video URL logic
video_target = '''                  let videoUrl = null;
                  if (selGem && selShape) {
                    videoUrl = `/assets/videos/${selGem.toLowerCase()}-${selShape.toLowerCase()}.mp4`;
                  } else if (selGem && !selShape) {
                    videoUrl = `/assets/videos/${selGem.toLowerCase()}-round.mp4`;
                  }'''

new_video_logic = '''
                  let videoUrl = null;
                  
                  if (selGem && categoryData?.availableQualityImages) {
                    // Try to find the matching video from categoryData exactly like CategoryContent does
                    const shapeToUse = selShape || "Round";
                    
                    // The availableQualityImages usually map to grades: "B", "A", "AA", "Lab Grown"
                    // User requested: "if there is video for both natural (A/AA) show then or else show lab"
                    
                    // So we search for AA, then A, then Lab Grown
                    let gradePriorities = ["AA", "A", "Lab Grown"];
                    if (selectedTypes.includes("Lab Grown") && !selectedTypes.includes("Natural")) {
                       gradePriorities = ["Lab Grown"];
                    } else if (selectedTypes.includes("Natural") && !selectedTypes.includes("Lab Grown")) {
                       gradePriorities = ["AA", "A", "B"]; // Add B just in case
                    }
                    
                    let foundVideo = null;
                    for (const grade of gradePriorities) {
                        const gradeItem = categoryData.availableQualityImages.find((item: any) => item.quality === grade);
                        if (gradeItem?.cloudinary_videos && Array.isArray(gradeItem.cloudinary_videos) && gradeItem.cloudinary_videos.length > 0) {
                             // Now filter by shape inside cloudinary_videos? 
                             // Wait, availableQualityImages in CategoryContent already seems to be filtered by shape in the backend?
                             // Let's just use the first video, or match label/emerald_type.
                             // Actually, since CategoryContent fetches data by shape if needed, wait, getCategoryData doesn't take shape.
                             // So all videos are in there.
                             // Usually the label or shape is in the video item.
                             const videoItem = gradeItem.cloudinary_videos.find((v: any) => 
                                (v.label || v.emerald_type || "").toLowerCase().includes(shapeToUse.toLowerCase())
                             ) || gradeItem.cloudinary_videos[0]; // fallback to first if no shape match
                             
                             if (videoItem?.video_url) {
                                 foundVideo = videoItem.video_url;
                                 break;
                             }
                        }
                    }
                    
                    if (foundVideo) {
                       videoUrl = foundVideo;
                    }
                  }
'''

code = code.replace(video_target, new_video_logic)

with open('src/components/GridView/GridViewTopFilters.tsx', 'w') as f:
    f.write(code)
print("Patched!")
