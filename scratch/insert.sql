INSERT INTO gemstone_specs 
(collection_slug, shape, size, ct_weight, cut, quality, price, type, color, image_url, cloudinary_videos, is_available, search_vector)
VALUES 
(
    'Alexandrite', 
    'Emerald Cut', 
    '4.00 x 3.00 mm', 
    0.20, 
    'Step-cut', 
    'Lab Grown', 
    17.00, 
    'Lab Grown', 
    'Green - Purple', 
    'https://res.cloudinary.com/dabdvgxd4/image/upload/v1755717220/IMG_2122_cygncf.png', 
    '[{"public_id": "Gemstone Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0192_t7hlzd_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172085/Gemstone%20Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0192_t7hlzd_mp4.mp4"}, {"public_id": "Gemstone Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0195_wil1fw_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172087/Gemstone%20Videos/Alexandrite/shape-emeraldCut/grade-Lab/IMG_0195_wil1fw_mp4.mp4"}]'::jsonb, 
    true, 
    to_tsvector('english', 'Alexandrite Emerald Cut 4.00 x 3.00 mm Lab Grown Green - Purple Step-cut')
);

INSERT INTO gemstone_specs 
(collection_slug, shape, size, ct_weight, cut, quality, price, type, color, image_url, cloudinary_videos, is_available, search_vector)
VALUES 
(
    'Alexandrite', 
    'Oval', 
    '4.00 x 3.00 mm', 
    0.20, 
    'Faceted', 
    'Lab Grown', 
    17.00, 
    'Lab Grown', 
    'Green - Purple', 
    'https://res.cloudinary.com/dabdvgxd4/image/upload/v1755717219/IMG_2023_qdh9ax.png', 
    '[{"public_id": "Gemstone Videos/Alexandrite/shape-oval/grade-Lab/IMG_0197_hrxh0b_mp4", "video_url": "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172088/Gemstone%20Videos/Alexandrite/shape-oval/grade-Lab/IMG_0197_hrxh0b_mp4.mp4"}]'::jsonb, 
    true, 
    to_tsvector('english', 'Alexandrite Oval 4.00 x 3.00 mm Lab Grown Green - Purple Faceted')
);
