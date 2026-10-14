const axios = require('axios');
axios.get('http://localhost:3000/api/getAllGemStones')
  .then(res => console.log(JSON.stringify(res.data.data.slice(0, 2), null, 2)))
  .catch(err => console.log(err.message));
