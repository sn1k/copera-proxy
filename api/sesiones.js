import chromium from "chrome-aws-lambda";
import playwright from "playwright-core";

export default async function handler(req, res) {
  try {
    const browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: true
    });

    const page = await browser.newPage();

    await page.goto("https://industrialcopera.net/programacion/", {
      waitUntil: "networkidle"
    });

    await page.click("button[data-filter='sesiones'], button:has-text('Sesiones')");
    await page.waitForTimeout(1000);

    const items = await page.evaluate(() => {
      const rows = [];
      const sel = document.querySelectorAll(".events-list li, .event-items__item");
      sel.forEach(el => {
        const text = el.textContent.trim();
        if (!text) return;
        const dateMatch = text.match(/(\d{1,2}\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)/);
        const titleMatch = text.match(/([A-Za-z0-9ÁÉÍÓÚáéíóúñÑ& ]+)/);
        if (dateMatch && titleMatch) {
          rows.push({
            date: dateMatch[1].trim(),
            title: titleMatch[1].trim()
          });
        }
      });
      return rows;
    });

    await browser.close();
    res.status(200).json(items);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Error scraping Copera" });
  }
}
