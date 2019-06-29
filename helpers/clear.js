const User = require('../models/user');
const Job = require('../models/job');

module.exports =  {
  user(done){
    if (process.env.NODE_ENV === '_test') {
      User
        .deleteMany({})
        .then(function() {
          done();
        })
    }
  },

  job(done){
    if (process.env.NODE_ENV === '_test') {
      Job
        .deleteMany({})
        .then(function() {
          done();
        })
    }
  }
}
