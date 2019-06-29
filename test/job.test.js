const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const modelUser = require('../models/user')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')
const { job } = require('../helpers/clear')

chai.should()
chai.use(chaiHttp)

let token = null

describe('Job', function () {

  before(function (done) {
    job(done)
  });
  
  let user = {
    name: 'pras',
    email: 'pras@gmail.com',
    password: '123'
  }
  before(function (done) {
    modelUser.create(user)
      .then(data => {
        return modelUser.findOne({ email: user.email })
      })
      .then(userFound => {
        if (userFound) {
          if (compare(user.password, userFound.password)) {
            token = sign({ _id: userFound._id, name: userFound.name, email: userFound.email })
            userId = userFound._id
          }
        }
        done()
      })
  });
  
  after(function (done) {
    modelUser
      .deleteOne({ email: user.email })
      .then(function () {
        done();
      })
  });

  describe('POST /', function () {
    it('should send a new object user', function (done) {
      this.timeout(3000)
      chai
        .request(app)
        .post('/job')
        .send({linkedin:'https://www.linkedin.com/jobs/view/1274802112/'})
        .set('authorization', token)
        .end(function (err, res) {
          console.log('yang ini', res.body);
          done();
        })
    })

    it('should send a error because invalid token', function (done) {
      this.timeout(3000)
      chai
        .request(app)
        .post('/job')
        .send({linkedin:'https://www.linkedin.com/jobs/view/1274802112/'})
        .set('authorization', 'token')
        .end(function (err, res) {
          console.log('yang ini', res.body);
          done();
        })
    })
  })

  describe('GET /', function () {
    it('should send array of object job', function (done) {
      chai
        .request(app)
        .get('/job')
        .set('authorization', token)
        .end(function (err, res) {
          res.should.to.have.status(200);
          res.body.should.be.a('array');

          done();
        })
    })
  })


  // describe('POST /signin', function () {
  //   it('should send a token', function (done) {
  //     chai
  //       .request(app)
  //       .post('/user/signin')
  //       .send(userLogin)
  //       .end(function (err, res) {
  //         res.should.to.have.status(200);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('token');
  //         res.body.token.should.be.a('string');
  //         done();
  //       })
  //   })

  //   it('should send a error message Bad request because wrong email', function (done) {
  //     chai
  //       .request(app)
  //       .post('/user/signin')
  //       .send(userLoginWrongEmail)
  //       .end(function (err, res) {
  //         res.should.to.have.status(400);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('msg');
  //         done();
  //       })
  //   })

  //   it('should send a error message bad request because wrong password', function (done) {
  //     chai
  //       .request(app)
  //       .post('/user/signin')
  //       .send(userLoginWrongPassword)
  //       .end(function (err, res) {
  //         res.should.to.have.status(400);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('msg');
  //         done();
  //       })
  //   })

  //   it('should send a error message bad request because wrong argument', function (done) {
  //     chai
  //       .request(app)
  //       .post('/user/signin')
  //       .send('sdasdasd')
  //       .end(function (err, res) {
  //         res.should.to.have.status(500);
  //         res.body.should.be.a('object');
  //         res.body.should.have.property('message');
  //         done();
  //       })
  //   })
  // })


})
