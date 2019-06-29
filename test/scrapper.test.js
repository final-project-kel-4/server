const chai = require('chai')
const chaiHttp = require('chai-http')

const { scrapJob } = require('../helpers/linkedin-scrapper')

chai.use(chaiHttp)

const expect = chai.expect

describe('Scrapper Tests', function () {
  this.timeout(10000)
  describe('Job scrapper test', () => {
    it('should run', (done) => {
      let jobUrl = 'https://www.linkedin.com/jobs/view/1274802112/'
      scrapJob(jobUrl)
        .then(data => {
          expect(Object.keys(data)).to.have.lengthOf.above(0)
          done()
        })
        .catch(err => console.log(err))
    })
  })
})
