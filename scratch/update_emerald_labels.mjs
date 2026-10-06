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

const urlMap = {
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172067/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0165_hssrqh_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172069/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0153_fkrd2v_mp4.mp4": "zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172078/Gemstone%20Videos/Emerald/shape-cushion/grade-Lab/IMG_0161_gxrq5f_mp4.mp4": "zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172056/Gemstone%20Videos/Emerald/shape-emeraldCut/grade-Lab/IMG_0147_l2wd7t_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172061/Gemstone%20Videos/Emerald/shape-emeraldCut/grade-Lab/IMG_0148_etc4hd_mp4.mp4": "zambian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172053/Gemstone%20Videos/Emerald/shape-heart/grade-Lab/IMG_0142_wiy7fl_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172058/Gemstone%20Videos/Emerald/shape-marquise/grade-Lab/IMG_0149_cue4op_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172064/Gemstone%20Videos/Emerald/shape-oval/grade-Lab/IMG_0154_jhkymo_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172071/Gemstone%20Videos/Emerald/shape-oval/grade-Lab/IMG_0155_nftdk0_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172074/Gemstone%20Videos/Emerald/shape-pear/grade-Lab/IMG_0156_qu5ppc_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172076/Gemstone%20Videos/Emerald/shape-pear/grade-Lab/IMG_0157_w3brvc_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172066/Gemstone%20Videos/Emerald/shape-princessCut/grade-Lab/IMG_0150_vwz264_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172081/Gemstone%20Videos/Emerald/shape-round/grade-Lab/IMG_0169_ksajdu_mp4.mp4": "colombian",
  "https://res.cloudinary.com/dabdvgxd4/video/upload/v1787172083/Gemstone%20Videos/Emerald/shape-round/grade-Lab/IMG_0170_ula4yk_mp4.mp4": "zambian",
};

async function main() {
  const query = `
    SELECT id, collection_slug, shape, quality, cloudinary_videos 
    FROM gemstone_specs 
    WHERE lower(collection_slug) = 'emerald' 
      AND cloudinary_videos IS NOT NULL
  `;
  
  const result = await pool.query(query);
  console.log(`Checking ${result.rows.length} rows...`);
  
  let updateCount = 0;

  for (const row of result.rows) {
    let modified = false;
    const newVideos = [...row.cloudinary_videos];
    
    for (let i = 0; i < newVideos.length; i++) {
      const vid = newVideos[i];
      if (vid.video_url && urlMap[vid.video_url]) {
        if (vid.emerald_type !== urlMap[vid.video_url]) {
          vid.emerald_type = urlMap[vid.video_url];
          modified = true;
        }
      }
    }
    
    if (modified) {
      // Update in DB
      await pool.query(
        `UPDATE gemstone_specs SET cloudinary_videos = $1 WHERE id = $2`,
        [JSON.stringify(newVideos), row.id]
      );
      updateCount++;
    }
  }
  
  console.log(`Successfully updated ${updateCount} rows.`);

  process.exit(0);
}

main().catch(console.error);
