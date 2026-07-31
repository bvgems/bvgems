# Cloudinary Video Upload & Sync Guide

This project is configured to automatically pull 360° videos from Cloudinary and link them to the correct gemstone, shape, color, and grade in the Supabase database.

If you or a future developer needs to upload new videos, follow these exact steps to ensure they appear on the website.

---

## 1. Uploading to Cloudinary

Videos must be uploaded and organized into a very specific folder structure in the Cloudinary Web UI. The synchronization script strictly relies on this folder structure to know which gemstone the video belongs to.

### The Required Folder Structure
You must place the video into an "Asset Folder" following this exact pattern:
`Gemstone Videos` > `[Gemstone Name]` > `[Shape/Color]` > `grade-[Grade]`

**Examples:**
- **For a Ruby (Lab Grown, Pear Shape):**
  `Gemstone Videos` > `Ruby` > `shape-pear` > `grade-Lab`
- **For a Sapphire (Pink, Oval Shape, Grade AA):**
  `Gemstone Videos` > `Sapphire` > `pink-oval` > `grade-AA`

### How to Upload via Cloudinary UI:
1. Log in to Cloudinary and go to your **Media Library**.
2. Navigate through the folders: `Gemstone Videos` -> `(Your Gemstone)` -> `(Your Shape/Color)` -> `(Your Grade)`.
3. If the folder does not exist, simply click the "New Folder" icon in the UI and create it following the exact naming convention above.
4. Drag and drop your video file into the folder. 
*(Note: The actual file name of the video does not matter (e.g., `IMG_0101.mp4` is fine), only the folder it sits in matters).*
3
---

## 2. Running the Synchronization Script

Once your videos are uploaded into the correct folders on Cloudinary, you must tell the database to fetch them.

1. Open your terminal and navigate to the project directory (`bvgems`).
2. Run the synchronization script:
   ```bash
   node scripts/syncCloudinaryVideos.mjs
   ```

**What the script does:**
- It uses the Cloudinary Search API to securely fetch all videos residing inside `Gemstone Videos/*`.
- It groups multiple videos together if they are in the exact same folder.
- It automatically connects to the Supabase Database and updates the `cloudinary_videos` column for the matching gemstone specification.

**Rate Limits:**
If you receive a `Rate Limit Exceeded` error (HTTP 420), you have hit Cloudinary's Admin API limit of 500 requests per hour. You will need to wait until the top of the next hour (e.g., 2:00 PM, 3:00 PM) for the limit to reset before you can run the script again.

---

## 3. Verifying on the Website

Once the script outputs `🎉 Sync complete!`, the videos are instantly live.

1. Start your local server (if it isn't already running) using `yarn dev`.
2. Go to the specific gemstone page (e.g., `http://localhost:3000/calibrated-faceted-gemstones/ruby`).
3. Select the matching Shape, Color, and Quality (e.g., Lab Grown).
4. You should now see the video player below the image thumbnails!
5. If you uploaded multiple videos into the exact same folder, a mini-carousel of video thumbnails will automatically appear below the main video.
