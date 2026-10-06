import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT) || 5432,
});

const VIDEO_LABELS = {
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
};

async function main() {
  console.log("Starting DB update for Emerald video labels...");
  
  const query = `
    SELECT id, cloudinary_videos 
    FROM gemstone_specs 
    WHERE lower(collection_slug) = 'emerald' 
      AND cloudinary_videos IS NOT NULL 
      AND jsonb_array_length(cloudinary_videos) > 0
  `;
  
  const result = await pool.query(query);
  let updatedCount = 0;
  
  for (const row of result.rows) {
    let modified = false;
    const newVideos = row.cloudinary_videos.map(vid => {
      if (vid.video_url && VIDEO_LABELS[vid.video_url]) {
        if (vid.label !== VIDEO_LABELS[vid.video_url]) {
          modified = true;
          return { ...vid, label: VIDEO_LABELS[vid.video_url] };
        }
      }
      return vid;
    });

    if (modified) {
      // NOTE: Uncomment the lines below to actually execute the DB update.
      // await pool.query(
      //   `UPDATE gemstone_specs SET cloudinary_videos = $1 WHERE id = $2`,
      //   [JSON.stringify(newVideos), row.id]
      // );
      updatedCount++;
    }
  }
  
  console.log(`Prepared to update ${updatedCount} rows in the database.`);
  console.log("NOTE: Actual DB update is commented out per user request. Run this script with uncommented lines to apply.");

  process.exit(0);
}

main().catch(console.error);
