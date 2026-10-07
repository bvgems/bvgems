const axios = require('axios');

axios.post('http://localhost:3000/api/getShapesData', {
  shape: "Round",
  collection: "Emerald",
  isSapphire: false
}).then(res => {
  console.log("Got response data length:", res.data.length);
  const itemsWithVideo = res.data.filter(i => i.cloudinary_videos && i.cloudinary_videos.length > 0);
  console.log("Items with video:", itemsWithVideo.length);
  if (itemsWithVideo.length > 0) {
    console.log("Sample video:", itemsWithVideo[0].cloudinary_videos);
  }
}).catch(err => {
  console.error("Error:", err.message);
});
