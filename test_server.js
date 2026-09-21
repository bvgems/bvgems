const { spawn } = require('child_process');

const server = spawn('yarn', ['run', 'dev']);

server.stdout.on('data', async (data) => {
  const str = data.toString();
  console.log(str);
  if (str.includes('Ready in') || str.includes('started server on') || str.includes('Ready on')) {
    console.log("Server is ready, testing links...");
    const fs = require('fs');
    const content = fs.readFileSync('src/utils/constants.ts', 'utf8');
    const links = [...content.matchAll(/link:\s*"([^"]+)"/g)].map(m => m[1]);
    const hrefs = [...content.matchAll(/href:\s*"([^"]+)"/g)].map(m => m[1]);
    const allLinks = Array.from(new Set([...links, ...hrefs]));

    let found404 = false;
    for (const link of allLinks) {
      if (!link.startsWith('/')) continue;
      try {
        const res = await fetch('http://localhost:3000' + link);
        if (res.status === 404) {
          console.log(`404 NOT FOUND: ${link}`);
          found404 = true;
        } else {
          console.log(`200 OK: ${link}`);
        }
      } catch (e) {
        console.log(`Error on ${link}: ${e.message}`);
      }
    }
    if (!found404) console.log("NO 404s FOUND");
    server.kill();
    process.exit(0);
  }
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});
