const User = require('../models/user');
const Job = require('../models/job');
const Matching = require('../models/matching')
const MatchingItem = require('../models/matchingitem')
const Candidate = require('../models/candidate')

module.exports =  {
  user(done){
    if (process.env.NODE_ENV === '_test') {
      User
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(done)
    }
  },

  job(done){
    if (process.env.NODE_ENV === '_test') {
      Job
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(done)
    }
  },

  matching(done) {
    if (process.env.NODE_ENV === '_test') {
      Matching
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(done)
    }
  },

  matchingItem(done) {
    if (process.env.NODE_ENV === '_test') {
      MatchingItem
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(done)
    }
  },

  candidate(done) {
    if (process.env.NODE_ENV === '_test') {
      Candidate
        .deleteMany({})
        .then(function() {
          done();
        })
        .catch(done)
    }
  }
}
