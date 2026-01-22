import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://industrialcopera.net/programacion/", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const html = await response.text();
    const $ = cheerio.load(html);
    const items = [];

    $("body *").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (!text) return;

      const m = text.match(/(\d{1,2}\s+ENE|\d{1,2}\s+FEB|\d{1,2}\s+MAR|\d{1,2}\s+ABR|\d{1,2}\s+MAY|\d{1,2}\s+JUN|\d{1,2}\s+JUL|\d{1,2}\s+AGO|\d{1,2}\s+SEP|\d{1,2}\s+OCT|\d{1,2}\s+NOV|\d{1,2}\s+DIC)\s+(.{3,60})/i);

      if (m) {
        const date = m[1].toUpperCase();
        const title = m[2].split("ENTRADAS")[0].split("+")[0].trim();

        if (title.length > 2) {
          items.push({ date, title });
        }
      }
    });

    const unique = [];
    const seen = new Set();

    for (const it of items) {
      const key = it.date + it.title;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(it);
      }
    }

    res.status(200).json(unique.slice(0, 20));
  } catch (e) {
    res.status(500).json({ error: "Scraping failed", detail: e.message });
  }
}
