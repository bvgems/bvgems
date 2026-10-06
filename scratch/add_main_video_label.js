const fs = require('fs');
const file = 'src/components/Category/CategoryContent.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                          <button
                            onClick={(e) => handleShareVideo(e, currentVideoUrl)}`;

const newStr = `                          {(selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label || EMERALD_VIDEO_LABELS?.[currentVideoUrl]) && (
                            <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1 rounded-full shadow-lg font-semibold uppercase tracking-widest pointer-events-none z-10">
                              {selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label || EMERALD_VIDEO_LABELS?.[currentVideoUrl]}
                            </div>
                          )}

                          <button
                            onClick={(e) => handleShareVideo(e, currentVideoUrl)}`;

content = content.replace(targetStr, newStr);

fs.writeFileSync(file, content);
console.log("Done");
