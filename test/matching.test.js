const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const app = require('../app')
const userModel = require('../models/user')
const jobModel = require('../models/job')
const matchingModel = require('../models/matching')
const clear = require('../helpers/clear')

chai.use(chaiHttp)

const expect = chai.expect

const user = {
  name: 'fulan',
  email: 'fulan@gmail.com',
  password: 'qweasdzxc'
}

const job = {
  title: 'UI/UX Designer',
  company: 'PT. Maju Mundur',
  linkedinURL: 'http://linkedin.com/jobs/view/123456',
  rawHtml: '<p>Need UI/UX Designer</p>',
  originalDescription: 'Need UI/UX Designer',
  cleanDescription: 'need ui/ux designer',
  user: {},
}

describe.only('Matching Tests', () => {
  before(function (done) {
    userModel
      .create(user)
      .then(user => {
        this.user = user
        this.token = jwt.sign({
          _id: this.user._id,
          email: this.user.email
        }, process.env.SECRET_JWT)
        done()
      })
      .catch(done)
  })

  before(function (done) {
    jobModel
      .create({
        ...job,
        user: this.user
      })
      .then(job => {
        this.job = job
        done()
      })
      .catch(done)
  })

  before(function (done) {
    matchingModel
      .create({
        job: this.job,
        items: [],
        user: this.user
      })
      .then(match => {
        this.match = match
        done()
      })
      .catch(done)
  })

  after(done => clear.user(done))
  after(done => clear.job(done))
  after(done => clear.matching(done))

  describe('GET /match', () => {
    it('should send an object with status code 200', function (done) {
      chai
        .request(app)
        .get(`/match/${this.match._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })
})
