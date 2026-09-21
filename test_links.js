const fs = require('fs');

const content = fs.readFileSync('src/utils/constants.ts', 'utf8');
const links = [...content.matchAll(/link:\s*"([^"]+)"/g)].map(m => m[1]);
const hrefs = [...content.matchAll(/href:\s*"([^"]+)"/g)].map(m => m[1]);

const allLinks = Array.from(new Set([...links, ...hrefs]));

async function check() {
  for (const link of allLinks) {
    if (!link.startsWith('/')) continue;
    try {
      const res = await fetch('http://localhost:3000' + link);
      if (res.status === 404) {
        console.log(`404: ${link}`);
      }
    } catch (e) {
      // server probably not running for this link, skip or handle
      console.log(`Error on ${link}: ${e.message}`);
    }
  }
}
check();
