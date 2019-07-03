/* istanbul ignore file */

const puppeteer = require('puppeteer')

const profileQueries = require('./queries').profile
const { scrollToBottom } = require('./dom-helpers')

async function scrapProfile (url, options = { headless: true }) {
  const browser = await puppeteer.launch({
    headless: options.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  // const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://127.0.0.1:9222/devtools/browser/acce605b-0115-41cd-b94e-36b6fe4cf2fa' })

  const pages = await browser.pages()
  const page = pages[0]

  await page.goto(url)
  await page.waitForNavigation({ waitUntil: 'networkidle0' })
  await page.evaluate(
    (q) => document.querySelector(q.links.login).click(),
    profileQueries
  )
  await page.evaluate(({ q, auth }) => {
    document.querySelector(q.inputs.email).value = auth.email
    document.querySelector(q.inputs.password).value = auth.password
    document.querySelector(q.buttons.login).click()
  }, {
    q: profileQueries,
    auth: { email: options.auth.email, password: options.auth.password }
  })
  await page.waitForNavigation({ waitUntil: 'networkidle2' })
  const isCaptcha = !!(await page.$('.app__content'))
  if (isCaptcha) {
    browser.close()
    throw Error('Error: LinkedIn asking for captcha.')
  } else {
    console.log('not captcha')
    await page.evaluate(scrollToBottom)
    await page.evaluate((q) => {
      const buttonMoreSkill = document.querySelector(q.buttons.moreSkill)
      if (buttonMoreSkill) {
        buttonMoreSkill.click()
      }
    }, profileQueries)
    await page.waitFor(500)
    pages[0].waitFor(1000).then(() => browser.close())
    return await page.evaluate((q) => {
      function isNull (el, msg) {
        if (el === null && typeof el === 'object') {
          console.log(msg)
          return undefined
        } else {
          return el
        }
      }
      let about = document.querySelector(q.about)
      let data = {
        photo: isNull(document.querySelector(q.photo), 'photo').getAttribute('src'),
        name: isNull(document.querySelector(q.name), 'name').innerText,
        currentJob: isNull(document.querySelector(q.currentJob), 'current job').innerText,
        about: about ? about.innerText : ''
      }
      data.experience = []
      let experiences = document.querySelectorAll(q.experience.items.root)
      for (let i = 0; i < experiences.length; i++) {
        let experience = {
          company: {
            logo: isNull(experiences[i].querySelector(q.experience.items.company.logo), 'logo 1').getAttribute('src')
          },
        }
        const isMulti = !!experiences[i].querySelector(q.experience.items.isMulti)
        if (isMulti) {
          experience.company.name = isNull(experiences[i].querySelector(q.experience.items.company.name.multi), 'multi company name').innerText
          experience.position = []
          let positions = experiences[i].querySelectorAll(q.experience.items.position.multi.items)
          for (let j = 0; j < positions.length; j++) {
            let desc = experiences[i].querySelector(q.experience.items.position.multi.root +' '+q.experience.items.position.description)
            experience.position.push({
              name: isNull(positions[j], 'multi position name', j).innerText,
              description: desc ? desc.innerText : ''
            })
          }
        } else {
          let desc = experiences[i].querySelector(q.experience.items.position.description)
          experience.company.name = isNull(experiences[i].querySelector(q.experience.items.company.name.single), 'single company name').innerText

          experience.position = {
            name: isNull(experiences[i].querySelector(q.experience.items.position.single), 'single position name').innerText,
            description: desc ? desc.innerText : ''
          }
        }
        data.experience.push(experience)
      }

      data.education = []
      let educations = document.querySelectorAll(q.education.items.root)
      for (let i = 0; i < educations.length; i++) {
        let degree = educations[i].querySelector(q.education.items.degree)
        let field = educations[i].querySelector(q.education.items.field)
        let education = {
          degree: degree ? degree.innerText : '',
          field: field ? field.innerText : '',
          school: {
            logo: isNull(educations[i].querySelector(q.education.items.school.logo), 'logo 2').getAttribute('src'),
            name: isNull(educations[i].querySelector(q.education.items.school.name), 'name').innerText
          }
        }
        data.education.push(education)
      }

      data.skill = []
      let skills = document.querySelectorAll(q.skill.items.root)
      for (let i = 0; i < skills.length; i++) {
        let skill = {}
        const title = skills[i].querySelector(q.skill.items.title).innerText
        skill[title] = []
        const skillNames = skills[i].querySelectorAll(q.skill.items.items)
        for (let j = 0; j < skillNames.length; j++) {
          skill[title].push(skillNames[j].innerText)
        }
        data.skill.push(skill)
      }
      return data
    }, profileQueries)
  }
}

module.exports = {
  scrapProfile
}
