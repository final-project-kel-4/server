const puppeteer = require('puppeteer')

const candidateQueries = {
  image: 'img.pv-top-card-section__photo',
  name: 'ul.pv-top-card-v3--list > li:first-child',
  about: 'p.pv-about__summary-text',
  experience: {
    'ul.pv-profile-section__section-info': [
      {
        'li.pv-position-entity': {
          companyLogo: 'img.pv-entity__logo-img',
          companyName: 'div.pv-entity__company-summary-info > h3',
          duration: 'div.pv-entity__company-summary-info > h4',
          position: {
            'ul.pv-entity__position-group': [
              {
                'div.pv-entity__role-details': {
                  summary: {
                    positionName: 'div.pv-entity__summary-info--background-section > h3 > span:last-child',
                    date: 'div.pv-entity__summary-info--background-section > div:first-of-type > h4:first-child > span:last-child',
                    duration: 'div.pv-entity__summary-info--background-section > div:first-of-type > h4:last-child > span:last-child'
                  }
                }
              }
            ]
          }
        }
      }
    ]
  }
}

const scrapJobByUrl = (url) => {
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
          // page.waitFor(500).then(() => browser.close())
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

module.exports = {
  scrapJobByUrl
}
