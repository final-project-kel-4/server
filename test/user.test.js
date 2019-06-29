const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const { user } = require('../helpers/clear')

chai.should()
chai.use(chaiHttp)

describe('User', function () {
  after(function (done) {
    user(done)
  });
  
  let newUser = {
    name: 'tio',
    email: 'tio@gmail.com',
    password: '123'
  }
  
  let userLogin = {
    email: newUser.email,
    password: newUser.password
  }
  
  let userLoginWrongPassword = {
    email: newUser.email,
    password: 'sasss'
  }
  
  let userLoginWrongEmail = {
    email: 'tes@gmail.com',
    password: newUser.password
  }
  describe('POST /signup', function () {
    it('should send a new object user', function (done) {
      chai
        .request(app)
        .post('/user/signup')
        .send(newUser)
        .end(function (err, res) {
          res.should.to.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('name');
          res.body.name.should.be.a('string');
          res.body.name.should.equal(newUser.name)
          res.body.should.have.property('email');
          res.body.email.should.be.a('string');
          res.body.email.should.equal(newUser.email);
          res.body.should.have.property('password');
          res.body.password.should.be.a('string');
          res.body.password.should.not.equal(newUser.password);
          done();
        })
    })

    it('should send a error because duplicate email', function (done) {
      chai
        .request(app)
        .post('/user/signup')
        .send(newUser)
        .end(function (err, res) {
          res.body.should.be.a('object');
          res.body.should.have.property('err');
          res.body.err.should.have.property('errors');
          res.body.err.errors.should.have.property('email');
          res.body.err.should.have.property('name');
          res.body.err.name.should.be.a('string');
          res.body.err.name.should.equal('ValidationError');
          done();
        })
    })
  })


  describe('POST /signin', function () {
    it('should send a token', function (done) {
      chai
        .request(app)
        .post('/user/signin')
        .send(userLogin)
        .end(function (err, res) {
          res.should.to.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.token.should.be.a('string');
          done();
        })
    })

    it('should send a error message Bad request because wrong email', function (done) {
      chai
        .request(app)
        .post('/user/signin')
        .send(userLoginWrongEmail)
        .end(function (err, res) {
          res.should.to.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('msg');
          done();
        })
    })

    it('should send a error message bad request because wrong password', function (done) {
      chai
        .request(app)
        .post('/user/signin')
        .send(userLoginWrongPassword)
        .end(function (err, res) {
          res.should.to.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('msg');
          done();
        })
    })

    it('should send a error message bad request because wrong argument', function (done) {
      chai
        .request(app)
        .post('/user/signin')
        .send('sdasdasd')
        .end(function (err, res) {
          res.should.to.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('message');
          done();
        })
    })
  })


})
