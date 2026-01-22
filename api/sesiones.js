import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const url = "https://apiw5.janto.es/v5/events/01?";
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const data = await response.json();
    const events = data.events || {};

    const items = [];

    for (const key in events) {
      const ev = events[key];
      if (!ev.name) continue;

      if (!/industrial\s+copera/i.test(ev.name)) continue;

      const ts = ev.startDate * 1000;
      const d = new Date(ts);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);

      const date = `${day}/${month}/${year}`;

      const title = ev.name
        .replace(/^\d{4}\s+\d{2}\s+\d{2}\s+/g, "")
        .replace(/industrial\s+copera\s+presenta:\s*/i, "")
        .trim();

      items.push({
        date,
        title,
        image: ev.image,
        url: `https://industrialcopera.janto.es/${ev.urlName}`
      });
    }

    items.sort((a, b) => {
      const pa = a.date.split("/").reverse().join("");
      const pb = b.date.split("/").reverse().join("");
      return pa.localeCompare(pb);
    });

    res.status(200).json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed", detail: e.message });
  }
}
