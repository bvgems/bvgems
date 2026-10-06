const fs = require('fs');
const file = 'src/components/Category/CategoryContent.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'const labelA = (a.label || EMERALD_VIDEO_LABELS[a.video_url] || "").toLowerCase();',
  'const labelA = (a.emerald_type || a.label || EMERALD_VIDEO_LABELS?.[a.video_url] || "").toLowerCase();'
);

content = content.replace(
  'const labelB = (b.label || EMERALD_VIDEO_LABELS[b.video_url] || "").toLowerCase();',
  'const labelB = (b.emerald_type || b.label || EMERALD_VIDEO_LABELS?.[b.video_url] || "").toLowerCase();'
);

content = content.replace(
  /\{\(video\.label \|\| EMERALD_VIDEO_LABELS\[video\.video_url\]\) && \(/g,
  '{(video.emerald_type || video.label || EMERALD_VIDEO_LABELS?.[video.video_url]) && ('
);

content = content.replace(
  /\{video\.label \|\| EMERALD_VIDEO_LABELS\[video\.video_url\]\}/g,
  '{video.emerald_type || video.label || EMERALD_VIDEO_LABELS?.[video.video_url]}'
);

fs.writeFileSync(file, content);
console.log("Done");
