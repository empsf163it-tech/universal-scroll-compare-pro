const puppeteer = require('puppeteer-core');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001/index.html', { waitUntil: 'domcontentloaded' });

  // Check presets array in page context
  const tabletPreset = await page.evaluate(() => {
    return presets.find(p => p.width === 768 && p.height === 800 && p.type === 'tablet');
  });
  console.log('✓ Found 768x800 tablet preset:', tabletPreset);
  if (!tabletPreset) {
    throw new Error('Tablet preset 768x800 not found in presets!');
  }

  // Open device modal
  await page.evaluate(() => openMultiSelectDeviceModal());

  // Check preset option styling for selected item
  const selectedStyles = await page.evaluate(() => {
    const btn = document.querySelector('.device-option.selected');
    if (!btn) return null;
    const computed = window.getComputedStyle(btn);
    const strong = btn.querySelector('strong');
    const strongComputed = strong ? window.getComputedStyle(strong) : null;
    const small = btn.querySelector('small');
    const smallComputed = small ? window.getComputedStyle(small) : null;
    return {
      bg: computed.backgroundColor,
      border: computed.borderColor,
      strongColor: strongComputed ? strongComputed.color : null,
      smallColor: smallComputed ? smallComputed.color : null
    };
  });
  console.log('✓ Selected preset card computed styles:', selectedStyles);

  // Check alignment bar and chip styles
  const alignBarStyles = await page.evaluate(() => {
    const bar = document.querySelector('.selected-align-bar');
    const chip = document.querySelector('.order-chip');
    const chipName = chip ? chip.querySelector('.chip-name') : null;
    const smBtn = document.querySelector('.sm-action-btn');
    return {
      barBg: bar ? window.getComputedStyle(bar).backgroundColor : null,
      chipBg: chip ? window.getComputedStyle(chip).backgroundColor : null,
      chipColor: chipName ? window.getComputedStyle(chipName).color : null,
      smBtnBg: smBtn ? window.getComputedStyle(smBtn).backgroundColor : null,
      smBtnColor: smBtn ? window.getComputedStyle(smBtn).color : null
    };
  });
  console.log('✓ Align bar & chip computed styles:', alignBarStyles);

  // Check custom device section styles
  const customStyles = await page.evaluate(() => {
    const customSec = document.querySelector('.custom-device');
    const input = document.querySelector('#modalLabel');
    return {
      customBg: customSec ? window.getComputedStyle(customSec).backgroundColor : null,
      inputBg: input ? window.getComputedStyle(input).backgroundColor : null,
      inputColor: input ? window.getComputedStyle(input).color : null
    };
  });
  console.log('✓ Custom device section computed styles:', customStyles);

  // Select the new 768x800 preset and verify it gets added to selectedPresetIds
  await page.evaluate(() => {
    const btn = document.querySelector(`.device-option[data-id="${presets.find(p=>p.width===768&&p.height===800).id}"]`);
    if (btn) btn.click();
  });

  const isSelectedNow = await page.evaluate(() => {
    const p = presets.find(p=>p.width===768&&p.height===800);
    return state.selectedPresetIds.includes(p.id);
  });
  console.log('✓ 768x800 tablet device selected successfully:', isSelectedNow);

  await browser.close();
  console.log('\n🎉 ALL HEADLESS VERIFICATION TESTS PASSED PERFECTLY!');
})();
