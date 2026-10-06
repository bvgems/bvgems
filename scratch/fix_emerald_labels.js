const fs = require('fs');
const file = 'src/components/Category/CategoryContent.tsx';
let content = fs.readFileSync(file, 'utf8');

// Line 441
content = content.replace(
  'const labelA = (a.emerald_type || a.label || EMERALD_VIDEO_LABELS?.[a.video_url] || "").toLowerCase();',
  'const labelA = (a.emerald_type || a.label || "").toLowerCase();'
);

// Line 442
content = content.replace(
  'const labelB = (b.emerald_type || b.label || EMERALD_VIDEO_LABELS?.[b.video_url] || "").toLowerCase();',
  'const labelB = (b.emerald_type || b.label || "").toLowerCase();'
);

// Line 746 & 748
content = content.replace(
  /\{\(selectedGradeVideos\[activeVideoIndex\]\?\.emerald_type \|\| selectedGradeVideos\[activeVideoIndex\]\?\.label \|\| EMERALD_VIDEO_LABELS\?\.\[currentVideoUrl\]\) && \(/g,
  '{(selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label) && ('
);

content = content.replace(
  /\{selectedGradeVideos\[activeVideoIndex\]\?\.emerald_type \|\| selectedGradeVideos\[activeVideoIndex\]\?\.label \|\| EMERALD_VIDEO_LABELS\?\.\[currentVideoUrl\]\}/g,
  '{selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label}'
);

// Line 762 & 764
content = content.replace(
  /\{\(selectedGradeVideos\[activeVideoIndex\]\?\.label \|\| EMERALD_VIDEO_LABELS\[currentVideoUrl\]\) && \(/g,
  '{(selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label) && ('
);

content = content.replace(
  /\{selectedGradeVideos\[activeVideoIndex\]\?\.label \|\| EMERALD_VIDEO_LABELS\[currentVideoUrl\]\}/g,
  '{selectedGradeVideos[activeVideoIndex]?.emerald_type || selectedGradeVideos[activeVideoIndex]?.label}'
);

// Line 794 & 796
content = content.replace(
  /\{\(video\.emerald_type \|\| video\.label \|\| EMERALD_VIDEO_LABELS\?\.\[video\.video_url\]\) && \(/g,
  '{(video.emerald_type || video.label) && ('
);

content = content.replace(
  /\{video\.emerald_type \|\| video\.label \|\| EMERALD_VIDEO_LABELS\?\.\[video\.video_url\]\}/g,
  '{video.emerald_type || video.label}'
);

fs.writeFileSync(file, content);
console.log("Done");
