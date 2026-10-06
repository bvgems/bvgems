const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:3000/calibrated-stones', { waitUntil: 'networkidle0' });
  
  // Wait for gems
  await page.waitForSelector('img[alt="Sapphire"]');
  
  // Click Sapphire
  await page.evaluate(() => {
    const sapphire = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Sapphire'));
    if(sapphire) sapphire.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Select Blue
  await page.evaluate(() => {
    const blue = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Blue'));
    if(blue) blue.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Select Yellow
  await page.evaluate(() => {
    const yellow = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Yellow'));
    if(yellow) yellow.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click Aquamarine
  await page.evaluate(() => {
    const aqua = Array.from(document.querySelectorAll('span')).find(el => el.textContent.includes('Aquamarine'));
    if(aqua) aqua.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'artifacts/screenshot.png', fullPage: true });
  await browser.close();
})();
