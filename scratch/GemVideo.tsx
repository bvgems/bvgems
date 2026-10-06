import React, { useState, useEffect, useRef } from 'react';

export const GemVideo = ({ gem, shape, selectedTypes, selectedGrades }: any) => {
  const [urlsToTry, setUrlsToTry] = useState<string[]>([]);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsLoaded(false);
    setCurrentUrlIndex(0);
    
    if (!gem) {
      setUrlsToTry([]);
      return;
    }

    const s = shape ? shape.toLowerCase() : 'round';
    const g = gem.toLowerCase();

    // Build potential URLs based on current filters and fallbacks
    const urls = [];
    
    // 1. If Type and Grade are selected, try the exact match
    if (selectedTypes.includes('Natural') && selectedGrades.length > 0) {
      urls.push(`/assets/videos/${g}-${s}-natural-${selectedGrades[0].toLowerCase()}.mp4`);
    } else if (selectedTypes.includes('Lab Grown')) {
      urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    }
    
    // 2. Try just type
    if (selectedTypes.includes('Natural')) {
      urls.push(`/assets/videos/${g}-${s}-natural.mp4`);
    } else if (selectedTypes.includes('Lab Grown')) {
      urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    }
    
    // 3. Fallbacks if nothing is specifically selected, or as a general fallback
    urls.push(`/assets/videos/${g}-${s}.mp4`);
    urls.push(`/assets/videos/${g}-${s}-natural.mp4`);
    urls.push(`/assets/videos/${g}-${s}-lab.mp4`);
    urls.push(`/assets/videos/${g}-round.mp4`);

    // Remove duplicates
    const uniqueUrls = Array.from(new Set(urls));
    setUrlsToTry(uniqueUrls);
    
  }, [gem, shape, selectedTypes, selectedGrades]);

  if (urlsToTry.length === 0 || currentUrlIndex >= urlsToTry.length) {
    return null;
  }

  const currentUrl = urlsToTry[currentUrlIndex];

  return (
    <div className={`w-full lg:w-[280px] shrink-0 mt-8 lg:mt-0 flex justify-center items-start lg:ml-auto transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0 hidden'}`}>
       <div className="w-[200px] h-[200px] lg:w-[240px] lg:h-[240px] rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 ring-1 ring-black/5">
          <video 
             ref={videoRef}
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
