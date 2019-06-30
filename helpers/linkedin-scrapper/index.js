/* istanbul ignore file */

const { scrapJob } = require('./job-scrapper')
const { scrapProfile } = require('./profile-scrapper')

module.exports = {
  scrapJob, scrapProfile
}
