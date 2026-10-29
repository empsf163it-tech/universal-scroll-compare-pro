const puppeteer = require('puppeteer-core');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  if (!fs.existsSync(chromePath)) {
    console.error('Chrome not found at', chromePath);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3001', { waitUntil: 'domcontentloaded' });

  // Open register modal
  await page.evaluate(() => openAuthModal('register'));

  // Test 1: Password toggle on regPassword
  const initialType1 = await page.$eval('#regPassword', el => el.type);
  await page.click('#toggleRegPasswordBtn');
  const toggledType1 = await page.$eval('#regPassword', el => el.type);
  await page.click('#toggleRegPasswordBtn');
  const revertedType1 = await page.$eval('#regPassword', el => el.type);
  console.log('✓ Test 1 - regPassword toggle:', { initialType1, toggledType1, revertedType1 });
  if (initialType1 !== 'password' || toggledType1 !== 'text' || revertedType1 !== 'password') {
    throw new Error('regPassword toggle failed');
  }

  // Test 2: Password toggle on regConfirmPassword
  const initialType2 = await page.$eval('#regConfirmPassword', el => el.type);
  await page.click('#toggleRegConfirmPasswordBtn');
  const toggledType2 = await page.$eval('#regConfirmPassword', el => el.type);
  await page.click('#toggleRegConfirmPasswordBtn');
  const revertedType2 = await page.$eval('#regConfirmPassword', el => el.type);
  console.log('✓ Test 2 - regConfirmPassword toggle:', { initialType2, toggledType2, revertedType2 });
  if (initialType2 !== 'password' || toggledType2 !== 'text' || revertedType2 !== 'password') {
    throw new Error('regConfirmPassword toggle failed');
  }

  // Test 3: Password toggle on loginPassword
  await page.click('#tabBtnSignIn');
  const initialType3 = await page.$eval('#loginPassword', el => el.type);
  await page.click('#toggleLoginPasswordBtn');
  const toggledType3 = await page.$eval('#loginPassword', el => el.type);
  await page.click('#toggleLoginPasswordBtn');
  const revertedType3 = await page.$eval('#loginPassword', el => el.type);
  console.log('✓ Test 3 - loginPassword toggle:', { initialType3, toggledType3, revertedType3 });
  if (initialType3 !== 'password' || toggledType3 !== 'text' || revertedType3 !== 'password') {
    throw new Error('loginPassword toggle failed');
  }

  // Test 4: Real-time match validation
  await page.click('#tabBtnRegister');
  await page.type('#regPassword', 'MySecret123');
  await page.type('#regConfirmPassword', 'MySecretMismatch');

  const mismatchHint = await page.$eval('#regPasswordMatchHint', el => ({
    text: el.textContent,
    className: el.className,
    visible: !el.classList.contains('hidden')
  }));
  console.log('✓ Test 4A - Mismatch indication:', mismatchHint);
  if (!mismatchHint.text.includes('do not match') || !mismatchHint.className.includes('mismatched')) {
    throw new Error('Mismatch indication failed');
  }

  // Clear and verify empty confirm hides hint
  await page.evaluate(() => {
    document.getElementById('regConfirmPassword').value = '';
    document.getElementById('regConfirmPassword').dispatchEvent(new Event('input'));
  });
  const emptyHintClass = await page.$eval('#regPasswordMatchHint', el => el.className);
  console.log('✓ Test 4B - Empty confirm hides hint:', emptyHintClass);
  if (!emptyHintClass.includes('hidden')) {
    throw new Error('Empty confirm should hide hint');
  }

  // Type matching password
  await page.type('#regConfirmPassword', 'MySecret123');
  const matchHint = await page.$eval('#regPasswordMatchHint', el => ({
    text: el.textContent,
    className: el.className,
    visible: !el.classList.contains('hidden')
  }));
  console.log('✓ Test 4C - Match indication:', matchHint);
  if (!matchHint.text.includes('match') || !matchHint.className.includes('matched')) {
    throw new Error('Match indication failed');
  }

  // Test 5: Client-side prevention on mismatch submit
  await page.evaluate(() => {
    document.getElementById('regConfirmPassword').value = 'DifferentVal';
    document.getElementById('regConfirmPassword').dispatchEvent(new Event('input'));
    document.getElementById('registerForm').dispatchEvent(new Event('submit', { cancelable: true }));
  });
  const alertText = await page.$eval('#authAlertBox', el => el.textContent);
  console.log('✓ Test 5 - Blocked mismatch alert:', alertText);
  if (!alertText.includes('Passwords do not match')) {
    throw new Error('Mismatch alert did not show expected message');
  }

  await browser.close();
  console.log('\n🎉 ALL HEADLESS PASSWORD & VALIDATION TESTS PASSED 100%!');
})();
