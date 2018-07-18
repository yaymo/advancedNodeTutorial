const puppeteer = require('puppeteer');
let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

// afterEach(async () => {
//   await browser.close();
// });

test('header has logo', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('clicking login starts oath flow', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test.only('when signed in, logout button is shown', async () => {
  const id = '5b4a294857de7f038accd013';
  const Buffer = require('safe-buffer').Buffer;
  const sessionObj = {
    passport: {
      user: id
    }
  }
  const sessionString = Buffer.from(
    JSON.stringify(sessionObj)
  ).toString('base64');
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig});

  await page.goto('localhost:3000');
});