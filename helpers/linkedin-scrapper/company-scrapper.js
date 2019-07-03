/* istanbul ignore file */

const puppeteer = require('puppeteer')

const companyQueries = require('./queries').company
const profileQueries = require('./queries').profile

async function scrapCompany (url, options = { headless: true }) {
  const browser = await puppeteer.launch({
    headless: options.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  // const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/acce605b-0115-41cd-b94e-36b6fe4cf2fa' })
  let jobs = []
  const pages = await browser.pages()
  const page = pages[0]

  await page.goto(url)
  await page.waitFor(3000)
  const loginForm = await page.$('form#join-form')

  if (loginForm) {
    browser.close()
    throw Error('LinkedIn need authentication')
    // await page.evaluate(
    //   (q) => document.querySelector(q.links.login).click(),
    //   profileQueries
    // )
    // await page.evaluate(({ q, auth }) => {
    //   document.querySelector(q.inputs.email).value = auth.email
    //   document.querySelector(q.inputs.password).value = auth.password
    //   document.querySelector(q.buttons.login).click()
    // }, {
    //   q: profileQueries,
    //   auth: { email: options.auth.email, password: options.auth.password }
    // })
    // await page.waitForNavigation({ waitUntil: 'networkidle2' })
  } else {
    await page.click(companyQueries.links.jobs)
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    await page.click(companyQueries.buttons.seeMoreJobs)
    jobs = await page.evaluate(async (q) => {
      const isNull = (el, msg) => {
        if (!el) {
          console.log(msg)
        } else {
          return el
        }
      }
      const company = {
        logo: document.querySelector(q.company.logo).getAttribute('src'),
        name: document.querySelector(q.company.name).innerText
      }
      const jobs = []
      const jobsListItem = document.querySelectorAll(q.jobs.items.root)
      for (let i = 0; i < jobsListItem.length - 1; i++) {
        const job = {
          title: document.querySelector('h2.topcard__title').innerText,
          company: {
            name: company.name,
            logo: company.logo,
            address: isNull(jobsListItem[i].querySelector(q.jobs.items.company.address), `company address ${i}`).innerText,
          },
          description: {}
        }
        jobsListItem[i].querySelector(q.jobs.items.link).click()
        await new Promise(r => setTimeout(r, 500))
        job.description.html = document.querySelector(q.jobs.items.description.html).innerHTML,
        job.description.text = document.querySelector(q.jobs.items.description.text).innerText
        jobs.push(job)
      }
      return jobs
    }, companyQueries)
    browser.close()
    return jobs
  }
}

module.exports = {
  scrapCompany
}
