const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("When logged in", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });
  test("can see blog create form", async () => {
    const formLabel = await page.getContentsOf("form label");
    expect(formLabel).toEqual("Blog Title");
  });

  describe("and using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button.right");
    });
    test("form shows error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      expect(contentError).toEqual("You must provide a value");
    });
  });

  describe("and using valid inputs", async () => {
    beforeEach(async () => {
      await page.type("div.title input", "My blog title");
      await page.type("div.content input", "My blog content");
      await page.click("form button.right");
    });

    test("submitting goes to review page", async () => {
      const headerText = await page.getContentsOf("h5");
      expect(headerText).toEqual("Please confirm your entries");
    });

    test("submitting and saving goes to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const titleText = await page.getContentsOf(".card-title");
      const contentText = await page.getContentsOf("p");

      expect(titleText).toEqual("My blog title");
      expect(contentText).toEqual("My blog content");
    });
  });
});

describe("When user is not logged in", async () => {
  test("user cannot get blogs", async () => {
    const res = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json"
        }
      }).then(res => res.json());
    });
    expect(res).toEqual({ error: "You must log in!" });
  });
  test("user cannot create blog post", async () => {
    const res = await page.evaluate(() => {
      return fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ title: "My title", content: "My content" })
      }).then(res => res.json());
    });
    expect(res).toEqual({ error: "You must log in!" });
  });
});
