const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "src/inex.js",
    // `headless: true` (default) enables old Headless;
    // `headless: 'new'` enables new Headless;
    // `headless: false` enables “headful” mode.
  });
  const page = await browser.newPage();

  const html = fs.readFileSync("sample.html", "utf-8");
  await page.goto("data:text/html;charset=UTF-8," + html);

  await page.emulateMediaType("screen");

  await page.pdf({
    path: "result.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  await browser.close();
})();
