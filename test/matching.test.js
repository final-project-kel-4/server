const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const app = require('../app')
const userModel = require('../models/user')
const jobModel = require('../models/job')
const Match = require('../models/matching')
const matchingItemModel = require('../models/matchingitem')
const candidateModel = require('../models/candidate')
const clear = require('../helpers/clear')
const TextUtility = require('../helpers/textProcessing')

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

const candidate = {
  name: user.name,
  linkedURL: 'https://linkedin.com/in/fulan',
  email: user.email,
  user: {}
}

describe('Matching Tests', () => {
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
    let count = 4
    Promise.all(Array.from(Array(count), () => (
      candidateModel
        .create({
          ...candidate,
          user: this.user
        })
    )))
      .then(candidates => {
        this.candidates = candidates
        done()
      })
      .catch(done)
  })

  before(function (done) {
    const scores = [2, 3, 1, 1]
    Promise.all(
      this.candidates.map((candidate, i) => (
        matchingItemModel
          .create({
            candidate: candidate,
            score: scores[i]
          })
      ))
    )
      .then(matchingItems => {
        this.matchingItems = matchingItems
        done()
      })
      .catch(done)
  })

  before(function (done) {
    Match
      .create({
        job: this.job,
        items: this.matchingItems,
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

  describe('GET /match/:id', () => {
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

    it('should send a string with status code 404 when match object can\'t be found', function (done) {
      chai
        .request(app)
        .get(`/match/${this.user._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(404)
          expect(res.body).to.be.a('string')
          done()
        })
    })

    it('should send an object and status code 500 when mongoose throw an error', function (done) {
      const stubFindOne = sinon.stub(Match, 'findOne')
      stubFindOne.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .get(`/match/${this.match._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubFindOne.restore()
          done()
        })
    })
  })

  describe('GET /match/:id/refresh', () => {
    it('should send with status code 200', function (done) {
      const scores = [2, 3, 1, 1]
      const stubTextUtility = sinon.stub(TextUtility, 'compareOneCandidate')
      stubTextUtility.onCall(0).returns(scores[0])
      stubTextUtility.onCall(1).returns(scores[1])
      stubTextUtility.onCall(2).returns(scores[2])
      stubTextUtility.returns(scores[3])
      chai
        .request(app)
        .get(`/match/${this.match._id}/refresh`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          stubTextUtility.restore()
          done()
        })
    })

    it('should send an object and status code 500 when mongoose throw an error', function (done) {
      const stubFindOne = sinon.stub(Match, 'findOne')
      stubFindOne.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .get(`/match/${this.match._id}/refresh`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubFindOne.restore()
          done()
        })
    })
  })
})
