const axios = require('axios');
const baseUrl = "https://bv-gems-server.vercel.app"; // Assuming this is the baseUrl from api.ts
axios.get(`${baseUrl}/api/getAllGemStones`).then(res => {
    if (res.data && res.data.length > 0) {
        console.log("Keys:", Object.keys(res.data[0]));
        console.log("Sample:", res.data[0]);
    }
}).catch(console.error);
