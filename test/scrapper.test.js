const chai = require('chai')
const chaiHttp = require('chai-http')

const { scrapJob, scrapProfile, scrapCompany } = require('../helpers/linkedin-scrapper')

chai.use(chaiHttp)

const expect = chai.expect

describe('Scrapper Tests', function () {
  this.timeout(50000)
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
  describe('Profile scrapper test', () => {
    it('should run', (done) => {
      let profileUrl = 'https://www.linkedin.com/in/andresuchitra/'
      let auth = {
        email: 'prasetio017@gmail.com',
        password: 'prasetio017'
      }
      scrapProfile(profileUrl, { auth })
        .then(data => {
          expect(Object.keys(data)).to.have.lengthOf.above(0)
          done()
        })
        .catch(err => console.log(err))
    })
  })
  describe('Company scrapper test', () => {
    it('should run', (done) => {
      let companyUrl = 'https://linkedin.com/company/pt--tokopedia'
      let auth = {
        email: 'prasetio017@gmail.com',
        password: 'prasetio017'
      }
      scrapCompany(companyUrl, { headless: false, auth })
        .then(data => {
          expect(Object.keys(data)).to.have.lengthOf.above(0)
          done()
        })
        .catch(err => console.log(err))
    })
  })
})
