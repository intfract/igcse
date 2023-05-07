/*
  Create sitemap.xml for google SEO
*/

import fs from 'fs'

const host = 'https://igcse.cyclic.app/'
const XML = '<?xml version="1.0" encoding="UTF-8"?>'

function indexFolder(dir, exclude) {
  const urls = []
  const folders = fs.readdirSync(dir).filter(file => !file.includes('.'))
  if (exclude.includes(dir)) return []
  if (!folders.length) return [dir]
  for (const folder of folders) {
    const path = dir + '/' + folder
    const items = indexFolder(path, exclude)
    urls.push(...items)
  }
  return [dir, ...urls]
}

function createMap(dir) {
  const urls = indexFolder(dir, ['views/404'])
  let urlset = ''
  for (const url of urls) {
    const relative = url.replace(/views(\/)?/g, '')
    const date = new Date()
    urlset += `\n\t<url>\n\t\t<loc>${host + relative}</loc>\n\t\t<lastmod>${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}</lastmod>\n\t</url>`
  }
  const sitemap = XML + `\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlset}\n</urlset>`
  return sitemap
}

fs.writeFileSync('public/sitemap.xml', createMap('views'))