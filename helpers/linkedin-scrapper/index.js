/* istanbul ignore file */

const { scrapJob } = require('./job-scrapper')
const { scrapProfile } = require('./profile-scrapper')
const { scrapCompany } = require('./company-scrapper')

module.exports = {
  scrapJob, scrapProfile, scrapCompany
}
