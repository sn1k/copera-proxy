import type { VercelRequest, VercelResponse } from '@vercel/node'
// import fetch from 'node-fetch'
// import * as cheerio from 'cheerio'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  res.status(200).json({
    sessions: [
      {
        date_raw: '',
        title: 'CURRO CARGA LA LOTERIA',
        info: 'PAGA LA LOTERÍA'
      },
      {
        date_raw: '',
        title: 'CURRO CARGA LA LOTERIA',
        info: 'PAGA LA LOTERÍA'
      },
      {
        date_raw: '',
        title: 'CURRO CARGA LA LOTERIA',
        info: 'PAGA LA LOTERÍA'
      }
    ]
  })
}

/*

import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const targetUrl = 'https://industrialcopera.net'
    const html = await fetch(targetUrl).then(r => r.text())
    const $ = cheerio.load(html)

    const sessions: any[] = []

    $('.event-list li.available').each((_, el) => {
      const dateRaw = $(el).find('.date').text().trim()
      const titleRaw = $(el).find('.artist').text().trim()
      const infoRaw = $(el).find('.location').text().trim()
      const url = $(el).find('a.buy').attr('href')

      const id =
        url?.split('/').filter(Boolean).pop() ||
        titleRaw.toLowerCase().replace(/\s+/g, '-')

      sessions.push({
        id,
        title: cleanText(titleRaw),
        date_raw: cleanText(dateRaw),
        info: cleanText(infoRaw),
        url,
        type: 'session'
      })
    })

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')

    res.status(200).json({
      source: 'industrialcopera.net',
      count: sessions.length,
      sessions
    })
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch sessions',
      details: error?.message || error
    })
  }
}

function cleanText(text: string) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
}

*/

