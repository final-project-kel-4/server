const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { user } = require('../helpers/clear')
const modelUser = require('../models/user')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const sinon = require('sinon')
const MatchingController = require('../controllers/matching')

chai.should()
chai.use(chaiHttp)

let token

let newUser = {
  name: 'pras',
  email: 'pras@gmail.com',
  password: '123'
}

before(function (done) {
  modelUser.create(newUser)
    .then(() => {
      return modelUser.findOne({ email: newUser.email })
    })
    .then(userFound => {
      if (userFound) {
        if (compare(newUser.password, userFound.password)) {
          token = sign({ _id: userFound._id, name: userFound.name, email: userFound.email })
        }
      }
      done()
    })
});

after(function (done) {
  user(done)
});

describe('Matching', function () {
  describe('GET /match/:id/refresh', function () {
    it('should send a object macthing', function (done) {
      chai
        .request(app)
        .get('/match/5d19b8089ca05f485ad02464/refresh')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('items');
          res.body.should.have.property('job');
          res.body.should.have.property('user');
          done();
        })
    })

    it('should send a error because wrong id Job', function (done) {
      chai
        .request(app)
        .get('/match/5d19b8089ca05f485ad02465/refresh')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(500);
          res.body.should.have.property('message');
          
          done();
        })
    })

    it('should send a error because wrong format id Job', function (done) {
      chai
        .request(app)
        .get('/match/5d19b8089ca05f4/refresh')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(500);
          res.body.should.have.property('message');
          
          done();
        })
    })

    it('should send a error because wrong id Job', function (done) {
      sinon.stub(MatchingController, 'matchCandidates').callsFake(() => null)
      chai
        .request(app)
        .get('/match/5d19b8089ca05f4/refresh')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(500);
          res.body.should.have.property('message');
          
          done();
        })
    })
  })

  describe('GET /match/:id', function () {
    it('should send one object macthing', function (done) {
      chai
        .request(app)
        .get('/match/5d19b8089ca05f485ad02464')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('items');
          res.body.should.have.property('job');
          res.body.should.have.property('user');
          done();
        })
    })

    it('should send error because wrong id matching', function (done) {
      chai
        .request(app)
        .get('/match/5d19b8089ca05f485ad02466')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          console.log(res.body);
          
          // res.should.to.have.status(200);
          // res.body.should.be.a('object');
          // res.body.should.have.property('items');
          // res.body.should.have.property('job');
          // res.body.should.have.property('user');
          done();
        })
    })

    it('should send error because wrong format id matching', function (done) {
      chai
        .request(app)
        .get('/match/5d19acde9f086f38859')
        .set('authorization', token)
        .send(newUser)
        .end(function (err, res) {
          console.log(res.body);
          
          // res.should.to.have.status(200);
          // res.body.should.be.a('object');
          // res.body.should.have.property('items');
          // res.body.should.have.property('job');
          // res.body.should.have.property('user');
          done();
        })
    })
  })

})

// matching.js           |    56.41 |    27.27 |    69.23 |       56 |... 11,134,153,154 |
// matching.js           |    87.93 |    71.43 |      100 |    87.27 |... 11,134,153,154 |

// Statements   : 57.31% ( 239/417 )
// Branches     : 38.16% ( 29/76 )
// Functions    : 50% ( 32/64 )
// Lines        : 57.21% ( 234/409 )

// Statements   : 57.93% ( 241/416 )
// Branches     : 39.47% ( 30/76 )
// Functions    : 50% ( 32/64 )
// Lines        : 57.84% ( 236/408 )