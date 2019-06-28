const puppeteer = require('puppeteer')

const scrapJobByUrl = (url) => {
  let browser
  let page

  return new Promise((resolve, reject) => {
    if (!/linkedin/g.test(url)) reject({ message: 'Not a linkedIn link' })
    if (!/job/g.test(url)) reject({ message: 'Not a linkedIn Job link' })
    resolve(
      puppeteer
      .launch({headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox']})
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
          () => {
            let data = {}
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
          }
        )
      })
    )
  })
}

module.exports = {
  scrapJobByUrl
}
