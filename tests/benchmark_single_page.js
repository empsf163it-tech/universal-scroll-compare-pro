const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('1. Launching browser...');
  let t = Date.now();
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security'
    ]
  });
  console.log('   Browser launched in', Date.now() - t, 'ms');

  console.log('2. Creating context...');
  t = Date.now();
  const context = await browser.createBrowserContext();
  console.log('   Context created in', Date.now() - t, 'ms');

  console.log('3. Creating new page...');
  t = Date.now();
  const page = await context.newPage();
  console.log('   Page created in', Date.now() - t, 'ms');

  console.log('4. Navigating to https://example.com...');
  t = Date.now();
  await page.goto('https://example.com', { waitUntil: 'domcontentloaded', timeout: 10000 });
  console.log('   Navigated in', Date.now() - t, 'ms');

  console.log('5. Taking screenshot...');
  t = Date.now();
  const buf = await page.screenshot({ type: 'jpeg', quality: 75 });
  console.log('   Screenshot captured in', Date.now() - t, 'ms, size:', buf.length, 'bytes');

  await browser.close();
  console.log('Done!');
})();
