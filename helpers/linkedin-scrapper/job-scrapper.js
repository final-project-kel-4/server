/* istanbul ignore file */

const puppeteer = require('puppeteer')

const jobQueries = require('./queries').job

async function scrapJob (url, options = { headless: true }) {
  const browser = await puppeteer.launch({
    headless: options.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const pages = await browser.pages()

  await pages[0].goto(url)
  pages[0].waitFor(1000).then(() => browser.close())
  return await pages[0].evaluate((queries) => {
    let data = {}
    data.company = {
      logo: document.querySelector(queries.company.logo).getAttribute('src'),
      name: document.querySelector(queries.company.name).innerText,
      address: document.querySelector(queries.company.address).innerText
    }
    data.title = document.querySelector(queries.title).innerText
    data.description = {
      html: document.querySelector(queries.description.html).innerHTML,
      text: document.querySelector(queries.description.text).innerText
    }
    return data
  }, jobQueries)
}

module.exports = {
  scrapJob
}
