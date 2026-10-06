const fs = require('fs');
const file = 'src/components/Category/CategoryContent.tsx';
let content = fs.readFileSync(file, 'utf8');

const EMERALD_LABELS = `const EMERALD_VIDEO_LABELS: Record<string, string> = {
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172067/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0165_hssrqh_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172069/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0153_fkrd2v_mp4.mp4": "Zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172078/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0161_gxrq5f_mp4.mp4": "Zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172056/Gemstone%20Videos/Emerald/shape-emeraldCut/grade-Lab/IMG_0147_l2wd7t_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172061/Gemstone%20Videos/Emerald/shape-emeraldCut/grade-Lab/IMG_0148_etc4hd_mp4.mp4": "Zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172053/Gemstone%20Videos/Emerald/shape-heart/grade-Lab/IMG_0142_wiy7fl_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172058/Gemstone%20Videos/Emerald/shape-marquise/grade-Lab/IMG_0149_cue4op_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172064/Gemstone%20Videos/Emerald/shape-oval/grade-Lab/IMG_0154_jhkymo_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172071/Gemstone%20Videos/Emerald/shape-oval/grade-Lab/IMG_0155_nftdk0_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172074/Gemstone%20Videos/Emerald/shape-pear/grade-Lab/IMG_0156_qu5ppc_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172076/Gemstone%20Videos/Emerald/shape-pear/grade-Lab/IMG_0157_w3brvc_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172066/Gemstone%20Videos/Emerald/shape-princessCut/grade-Lab/IMG_0150_vwz264_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172081/Gemstone%20Videos/Emerald/shape-round/grade-Lab/IMG_0169_ksajdu_mp4.mp4": "Colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172083/Gemstone%20Videos/Emerald/shape-round/grade-Lab/IMG_0170_ula4yk_mp4.mp4": "Zambian"
};`;

if (!content.includes('EMERALD_VIDEO_LABELS')) {
  content = content.replace(
    'export const CategoryContent = ({',
    EMERALD_LABELS + '\n\nexport const CategoryContent = ({'
  );
}

// Add the label overlay on the main video
const overlayBlock = `                            {isSharingVideo ? <Loader size={20} color="white" /> : <IconShare size={20} stroke={1.5} />}
                          </button>
                          
                          {(selectedGradeVideos[activeVideoIndex]?.label || EMERALD_VIDEO_LABELS[currentVideoUrl]) && (
                            <div className="absolute bottom-2 left-2 z-10 bg-black/60 text-white px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider backdrop-blur-sm pointer-events-none">
                              {selectedGradeVideos[activeVideoIndex]?.label || EMERALD_VIDEO_LABELS[currentVideoUrl]}
                            </div>
                          )}`;

content = content.replace(
  `                            {isSharingVideo ? <Loader size={20} color="white" /> : <IconShare size={20} stroke={1.5} />}
                          </button>`,
  overlayBlock
);

// Add the label on the carousel thumbnails
const thumbOverlayBlock = `                                      muted
                                      playsInline
                                    />
                                    {(video.label || EMERALD_VIDEO_LABELS[video.video_url]) && (
                                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                                        {video.label || EMERALD_VIDEO_LABELS[video.video_url]}
                                      </div>
                                    )}
                                  </div>
                                </Carousel.Slide>`;

content = content.replace(
  `                                      muted
                                      playsInline
                                    />
                                  </div>
                                </Carousel.Slide>`,
  thumbOverlayBlock
);

// We must also ensure the thumb div is relative for the absolute badge to position correctly
content = content.replace(
  `                                    className={\`cursor-pointer border-2 rounded p-1 transition-all \${activeVideoIndex === index
                                      ? "border-black shadow-md"
                                      : "border-transparent hover:border-gray-300"
                                      }\``,
  `                                    className={\`relative cursor-pointer border-2 rounded p-1 transition-all \${activeVideoIndex === index
                                      ? "border-black shadow-md"
                                      : "border-transparent hover:border-gray-300"
                                      }\``
);

fs.writeFileSync(file, content);
console.log("Done");
