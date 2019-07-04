const User = require('../models/user');
const Job = require('../models/job');
const Matching = require('../models/matching')
const MatchingItem = require('../models/matchingitem')
const Candidate = require('../models/candidate')

module.exports = {
  all: (done) => {
    /* istanbul ignore else */
    if (process.env.NODE_ENV === '_test') {
      Promise.all([
        User.deleteMany({}),
        Job.deleteMany({}),
        Matching.deleteMany({}),
        MatchingItem.deleteMany({}),
        Candidate.deleteMany({})
      ])
        .then(() => done())
        .catch(done)
    }
  }
}
