const fs = require('fs');
const file = 'src/components/Category/CategoryContent.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Sort the selectedGradeVideos
const oldSortStr = `  const selectedGradeVideos = Array.isArray(selectedGradeItem?.cloudinary_videos)
    ? selectedGradeItem.cloudinary_videos
    : [];`;

const newSortStr = `  const selectedGradeVideos = Array.isArray(selectedGradeItem?.cloudinary_videos)
    ? [...selectedGradeItem.cloudinary_videos].sort((a: any, b: any) => {
        const labelA = (a.label || EMERALD_VIDEO_LABELS[a.video_url] || "").toLowerCase();
        const labelB = (b.label || EMERALD_VIDEO_LABELS[b.video_url] || "").toLowerCase();
        if (labelA === "colombian" && labelB !== "colombian") return -1;
        if (labelB === "colombian" && labelA !== "colombian") return 1;
        if (labelA === "zambian" && labelB !== "zambian") return -1;
        if (labelB === "zambian" && labelA !== "zambian") return 1;
        return 0;
      })
    : [];`;

content = content.replace(oldSortStr, newSortStr);

// 2. Update Main Video Overlay Design
const oldMainOverlay = `<div className="absolute bottom-2 left-2 z-10 bg-black/60 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-sm pointer-events-none">`;
const newMainOverlay = `<div className="absolute bottom-3 left-3 z-10 bg-black/20 backdrop-blur-[8px] border border-white/20 text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.15em] pointer-events-none">`;
content = content.replace(oldMainOverlay, newMainOverlay);

// 3. Update Thumb Overlay Design
const oldThumbOverlay = `<div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">`;
const newThumbOverlay = `<div className="absolute bottom-1 left-1 bg-black/20 backdrop-blur-[6px] border border-white/20 text-white text-[8px] px-2 py-0.5 rounded-full shadow-sm font-semibold uppercase tracking-widest pointer-events-none">`;
content = content.replace(oldThumbOverlay, newThumbOverlay);

fs.writeFileSync(file, content);
console.log("Done");
