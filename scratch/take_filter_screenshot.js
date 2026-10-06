const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  await page.goto('http://localhost:3000/calibrated-stones', { waitUntil: 'networkidle0' });
  
  // The gem types are divs with class flex flex-col items-center gap-2 cursor-pointer
  // We need to click on Sapphire, then Blue, then Yellow
  
  await page.evaluate(() => {
    const gemLabels = Array.from(document.querySelectorAll('span.text-xs.font-medium, span.text-xs.font-bold'));
    
    // Click Sapphire
    const sapphire = gemLabels.find(el => el.textContent.includes('Sapphire'));
    if(sapphire) sapphire.click();
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  // Now click colors
  await page.evaluate(() => {
    const colors = Array.from(document.querySelectorAll('div.cursor-pointer span.text-xs'));
    const blue = colors.find(el => el.textContent.includes('Blue'));
    if(blue) blue.click();
    
    const yellow = colors.find(el => el.textContent.includes('Yellow'));
    if(yellow) yellow.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'artifacts/sapphire_colors.png', fullPage: true });
  await browser.close();
})();
