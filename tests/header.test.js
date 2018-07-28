const Page = require('./helpers/page');
let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});

test('header has logo', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('clicking login starts oath flow', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test('when signed in, logout button is shown', async () => {
  await page.login();

  const logoutButtonText = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(logoutButtonText).toEqual('Logout');
});