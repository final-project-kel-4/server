const puppeteer = require('puppeteer')

const scrapJob = (url) => {
  const jobQueries = {
    company: {
      name: 'a.topcard__org-name-link',
      img: 'img.company-logo',
      address: 'span.topcard__flavor--bullet'
    },
    jobTitle: 'h1.topcard__title'
  }
  let browser
  let page

  return new Promise((resolve, reject) => {
    if (!/linkedin/g.test(url)) reject({ message: 'Not a linkedIn link' })
    if (!/job/g.test(url)) reject({ message: 'Not a linkedIn Job link' })

    resolve(
      puppeteer
        .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        .then(obj => {
          browser = obj
          return browser.newPage()
        })
        .then(obj => {
          page = obj
          return page.goto(url)
        })
        .then(() => {
          page.waitFor(500).then(() => browser.close())
          return page.evaluate(
            (jobQueries) => {
              let data = {}
              data.company = {
                name: document.querySelector(jobQueries.company.name).innerText,
                img: document.querySelector(jobQueries.company.img).getAttribute('src'),
                address: document.querySelector(jobQueries.company.address).innerText
              }
              data.jobTitle = document.querySelector(jobQueries.jobTitle).innerText
              data.rawHtml = document.querySelector('section.description').innerHTML
              data.rawText = document.querySelector('.description__text').textContent
              const paragraphs = document
                .querySelector('.description__text')
                .getElementsByTagName('p')
              if (paragraphs.length) {
                data['Short Description'] = Array
                  .from(paragraphs)
                  .map(p => p.innerText.trim())
                  .filter(p => p.split('.').length > 1)
              }
              const childNodes = document
                .querySelector('.description__text')
                .childNodes
              let tags = []
              childNodes.forEach(node => tags.push(node.tagName))
              if (tags.includes('UL') || tags.includes('OL')) {
                childNodes.forEach((node, i) => {
                  if (node.tagName === 'UL' || node.tagName === 'OL') {
                    let values = []
                    let key = ''
                    node.childNodes.forEach(n => {
                      if (!/\n/.test(n.innerText))
                        values.push(n.innerText)
                    })
                    let before = i - 1
                    while (!key && before >= 0) {
                      key = childNodes[before].innerText
                      if (key)
                        key = key.replace(/\n/g, '').trim()
                      before -= 1
                    }
                    if (!key) key = undefined
                    data[key] = values
                  }
                })
              }
              return data
            }, jobQueries
          )
        })
    )
  })
}

function scrapProfile (url) {
  const queries = {
    link: {
      login: 'a.form-toggle'
    },
    input: {
      email: 'input#login-email',
      password: 'input#login-password'
    },
    button: {
      login: 'input#login-submit'
    },
    image: 'img.pv-top-card-section__photo',
    name: 'ul.pv-top-card-v3--list > li:first-child',
    about: 'p.pv-about__summary-text'
  }

  let browser
  let page

  return new Promise((resolve, reject) => {
    if (!/linkedin/g.test(url)) reject({ message: 'Not a linkedIn link' })
    if (!/job/g.test(url)) reject({ message: 'Not a linkedIn Job link' })

    resolve(
      puppeteer
      .launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      .then(obj => {
        browser = obj
        return browser.newPage()
      })
      .then(obj => {
        page = obj
        return page.goto(url)
      })
      .then(() => page.waitForNavigation({ waitUntil: 'networkidle0' }))
      .then(() => page.evaluate((queries) => document.querySelector(queries.link.login).click(), queries))
      .then(() => page.waitFor(3000))
      .then(() => page.evaluate(
        (queries) => {
          document.querySelector(queries.input.email).value = 'mprasetiodc.official@gmail.com'
          document.querySelector(queries.input.password).value = 'mprasetiodc'
          document.querySelector(queries.button.login).click()
        }, queries
      ))
      .then(() => page.waitForNavigation({ waitUntil: 'networkidle2'}))
      .then(() => page.evaluate(scrollToBottom))
      .then(() => page.evaluate(
        () => {
          const links = document.querySelector('section#experience-section').querySelectorAll('a')
          for (let i = 0; i < links.length; i++) {
            if (links[i])
              if (/See more/i.test(links[i].innerText)) {
                links[i].click()
              }
          }
          document.querySelector('button.pv-skills-section__additional-skills').click()
          document.querySelector('button.pv-profile-section__see-more-inline').click()
        }
      ))
      .then(() => page.waitFor(3000))
      .then(() => page.evaluate(
        (queries) => {
          const getInnerText = (rootEl, selector) => {
            if (rootEl.querySelector(selector)) {
              return rootEl.querySelector(selector).innerText
            } else {
              ''
            }
          }
          const data = {
            image: document.querySelector(queries.image).getAttribute('src'),
            name: getInnerText(document, queries.name),
            about: getInnerText(document, queries.about)
          }
          data.experiences = []

          const experiences = document.querySelectorAll('li.pv-position-entity')

          for (let i = 0; i < experiences.length; i++) {
            const company = experiences[i]
            const isMultiPosition = !!company.querySelector('ul.pv-entity__position-group')
            if (isMultiPosition) {
              const positions = company.querySelectorAll('li.pv-entity__position-group-role-item')
              data.experiences.push(
                {
                  company: {
                    logo: company.querySelector('img.pv-entity__logo-img').getAttribute('src'),
                    name: getInnerText(company, 'div.pv-entity__company-summary-info > h3 > span:last-child')
                  },
                  duration: getInnerText(company, 'div.pv-entity__company-summary-info > h4 > span:last-child'),
                  positions: []
                }
              )
              for (let j = 0; j < positions.length; j++) {
                data.experiences[data.experiences.length - 1].positions.push({
                  name: getInnerText(positions[j], 'div.pv-entity__summary-info--background-section > h3:first-child > span:last-child'),
                  duration: getInnerText(positions[j], 'div.pv-entity__summary-info--background-section > div:first-of-type > h4:first-child > span:last-child'),
                  description: getInnerText(positions[j], 'p.pv-entity__description')
                })
              }
            } else {
              data.experiences.push(
                {
                  company: {
                    logo: company.querySelector('img.pv-entity__logo-img').getAttribute('src'),
                    name: getInnerText(company, 'div.pv-entity__summary-info > h4:first-of-type > span:last-child')
                  },
                  duration: getInnerText(company, 'h4.pv-entity__date-range > span:last-child'),
                  position: getInnerText(company, 'div.pv-entity__summary-info > h3:first-child'),
                  description: getInnerText(company, 'p.pv-entity__description')
                }
              )
            }
          }

          const skillSection = document.querySelector('section.pv-skill-categories-section')
          const skills = skillSection.querySelectorAll('div.pv-skill-category-list')
          const skillData = {}
          for (let i = 0; i < skills.length; i++) {
            const title = getInnerText(skills[i], 'h3.pv-skill-categories-section__secondary-skill-heading')
            skillData[title] = []
            const skillsTextDom = skills[i].querySelectorAll('span.pv-skill-category-entity__name-text')
            for (let j = 0; j < skillsTextDom.length; j++) {
              skillData[title].push(skillsTextDom[j].innerText)
            }
          }
          data.skills = skillData

          const interestSection = document.querySelector('section.pv-interests-section')
          const interestsData = []
          const interestsTag = interestSection.querySelectorAll('li.pv-interest-entity')
          for (let i = 0; i < interestsTag.length; i++) {
            interestsData.push({
              logo: interestsTag[i].querySelector('img.pv-entity__logo-img').getAttribute('src'),
              name: getInnerText(interestsTag[i], 'span.pv-entity__summary-title-text')
            })
          }
          data.interest = interestsData

          const educationSection = document.querySelector('section#education-section')
          const educationItems = educationSection.querySelectorAll('li.pv-profile-section__section-info-item')
          const educationData = []
          for (let i = 0; i < educationItems.length; i++) {
            educationData.push({
              logo: educationItems[i].querySelector('img.pv-entity__logo-img').getAttribute('src'),
              degree: {
                institute: getInnerText(educationItems[i], 'h3.pv-entity__school-name'),
                degree: getInnerText(educationItems[i], 'p.pv-entity__degree-name > span:last-child'),
                field: getInnerText(educationItems[i], 'p.pv-entity__fos > span:last-child'),
                grade: getInnerText(educationItems[i], 'p.pv-entity__grade > span:last-child'),
                date: getInnerText(educationItems[i], 'p.pv-entity__dates > span:last-child')
              }
            })
          }
          data.education = educationData

          return data
        }, queries
      ))
    )
  })
}

function scrollToBottom() {
  return new Promise(resolve => {
    const distance = 100; // should be less than or equal to window.innerHeight
    const delay = 100;
    const timer = setInterval(() => {
      document.scrollingElement.scrollBy(0, distance);
      if (document.scrollingElement.scrollTop + window.innerHeight >= document.scrollingElement.scrollHeight) {
        clearInterval(timer)
        resolve();
      }
    }, delay)
  })
}

module.exports = {
  scrapJob, scrapProfile
}
