const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')
const sinon = require('sinon')

const app = require('../app')
const userModel = require('../models/user')
const Job = require('../models/job')
const Matching = require('../models/matching')
const matchingItemModel = require('../models/matchingitem')
const candidateModel = require('../models/candidate')
const clearDb = require('../helpers/clear')
const scrapper = require('../helpers/linkedin-scrapper')

const expect = chai.expect

chai.use(chaiHttp)

const user = {
  name: 'fulan',
  email: 'fulan@gmail.com',
  password: 'qweasdzxc'
}

const candidate = {
  name: user.name,
  linkedinURL: 'http://linkedin.com/in/fulan',
  email: user.email,
  user: {}
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

const linkedInJobData = {
  title: job.title,
  company: job.company,
  description: {
    html: job.rawHtml,
    text: job.originalDescription
  }
}

const linkedInProfileData = {
  name: 'Fulan',
  photo: 'https://my-image.com/fulan.jpg',
  currentJob: 'Programmer',
  about: '',
  experience: [
    {
      position: [
        {
          name: '',
          description: ''
        }
      ]
    },
    {
      position: {
        name: '',
        description: ''
      }
    }
  ],
  education: [
    {
      field: ''
    }
  ]
}

describe('Job Tests', () => {
  before(function (done) {
    this.stubScrap = sinon.stub(scrapper, 'scrapJob')
    this.stubScrap.callsFake(() => linkedInJobData)
    sinon.stub(scrapper, 'scrapProfile').callsFake(() => linkedInProfileData)
    done()
  })

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
    candidateModel
      .create({
        ...candidate,
        email: 'fulan@email.com',
        user: this.user
      })
      .then(candidate => {
        this.candidate = candidate
        done()
      })
      .catch(done)
  })

  before(function (done) {
    matchingItemModel
      .create({
        candidate: this.candidate
      })
      .then(matchingItem => {
        this.matchingItem = matchingItem
        done()
      })
      .catch(done)
  })

  before(function (done) {
    Job
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
    Job
      .create({
        ...job,
        about: 'dummy text',
        user: this.user
      })
      .then(job => {
        this.otherJob = job
        done()
      })
      .catch(done)
  })

  before(function (done) {
    Matching
      .create({
        job: this.job,
        items: [this.matchingItem],
        user: this.user
      })
      .then(match => {
        this.match = match
        done()
      })
      .catch(done)
  })

  before(function (done) {
    Matching
      .create({
        job: this.otherJob,
        user: this.user
      })
      .then(match => {
        this.match = match
        done()
      })
      .catch(done)
  })

  after(done => {
    sinon.restore()
    done()
  })
  after(done => clearDb.user(done))
  after(done => clearDb.matching(done))
  after(done => clearDb.matchingItem(done))
  after(done => clearDb.candidate(done))
  after(done => clearDb.job(done))

  describe('GET /job', () => {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get('/job')
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('array')
          done()
        })
    })

    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubFind = sinon.stub(Job, 'find')
      stubFind.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .get('/job')
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubFind.restore()
          done()
        })
    })
  })

  describe('GET /job/:id', () => {
    it('should send an object with 200 status code', function (done) {
      chai
        .request(app)
        .get(`/job/${this.job._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubFindOne = sinon.stub(Matching, 'findOne')
      stubFindOne.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .get(`/job/${this.job._id}`)
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

  describe('POST /job', () => {
    const jobUrl = 'https://linkedin.com/jobs/view/123456'
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/job')
        .send({ linkedin: jobUrl })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubCreate = sinon.stub(Job, 'create')
      stubCreate.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .post('/job')
        .send({ linkedin: jobUrl })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubCreate.restore()
          done()
        })
    })

    it('should send error object and status code 500 when failed to scrap job', function (done) {
      this.stubScrap.restore()
      this.stubScrap = sinon.stub(scrapper, 'scrapJob')
      this.stubScrap.callsFake(() => {
        return undefined
      })

      chai
        .request(app)
        .post('/job')
        .send({ linkedin: jobUrl })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })

  describe('POST /job/addCandidate', () => {
    const profileUrl = 'https://linkedin.com/in/afdal-lismen'
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/job/addCandidate')
        .send({ linkedin: profileUrl, jobId: this.job._id })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .post('/job/addCandidate')
        .send({ linkedin: profileUrl, jobId: this.otherJob._id })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send an object with 201 status code adding same profile to the same job', function (done) {
      chai
        .request(app)
        .post('/job/addCandidate')
        .send({ linkedin: profileUrl, jobId: this.job._id })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send an object with 201 status code when adding same user profile into different jobs', function (done) {
      chai
        .request(app)
        .post('/job/addCandidate')
        .send({ linkedin: profileUrl, jobId: this.otherJob._id })
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })
  })

  describe('DELETE /job/:Id', () => {
    it('should send an object with 201 status code', function (done) {
      chai
        .request(app)
        .delete(`/job/${this.job._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(201)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubDelete = sinon.stub(Job, 'findOneAndDelete')
      stubDelete.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .delete(`/job/${this.otherJob._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubDelete.restore()
          done()
        })
    })
  })
})
