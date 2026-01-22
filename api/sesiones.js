import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://industrialcopera.net/programacion/");
    const html = await response.text();

    const $ = cheerio.load(html);
    const items = [];

    $(".event-items__item, .events-list li").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      if (!text) return;

      const dateMatch = text.match(/(\d{1,2}\s+[A-Za-zÁÉÍÓÚáéíóúñÑ]+)/);
      if (!dateMatch) return;

      const date = dateMatch[1];
      const title = text.replace(date, "").split("+")[0].trim();

      items.push({ date, title });
    });

    res.status(200).json(items.slice(0, 20));
  } catch (e) {
    res.status(500).json({ error: "Scraping failed", detail: e.message });
  }
}
