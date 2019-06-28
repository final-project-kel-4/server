const User = require('../models/user');

module.exports =  {
  user(done){
    if (process.env.NODE_ENV === 'test') {
      User
        .deleteMany({})
        .then(function() {
          done();
        })
    }
  }
}
