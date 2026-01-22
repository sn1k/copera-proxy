import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const url = "https://industrialcopera.janto.es";
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $(".vertical-card").each((_, el) => {
      const day = $(el).find(".vertical-card__day").text().trim();
      const month = $(el).find(".vertical-card__month").text().trim();
      const year = $(el).find(".vertical-card__year").text().trim();
      const titleRaw = $(el).find(".vertical-card__title").text().replace(/\s+/g, " ").trim();

      if (!day || !month || !year || !titleRaw) return;

      if (!/industrial\s+copera/i.test(titleRaw)) return;

      const monthMap = {
        "ene.": "01", "feb.": "02", "mar.": "03", "abr.": "04",
        "may.": "05", "jun.": "06", "jul.": "07", "ago.": "08",
        "sep.": "09", "oct.": "10", "nov.": "11", "dic.": "12"
      };

      const mm = monthMap[month.toLowerCase()] || "01";
      const yyyy = `20${year}`;
      const dateISO = `${yyyy}-${mm}-${day.padStart(2, "0")}`;

      // Limpieza del título
      const title = titleRaw
        .replace(/^\d{4}\s+\d{2}\s+\d{2}\s+/g, "")
        .replace(/industrial\s+copera\s+presenta:\s*/i, "")
        .trim();

      items.push({ date: dateISO, title });
    });

    res.status(200).json(items);
  } catch (e) {
    res.status(500).json({ error: "Scraping failed", detail: e.message });
  }
}
