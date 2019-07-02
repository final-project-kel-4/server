const chai = require('chai')
const chaiHttp = require('chai-http')
const sinon = require('sinon')
const jwt = require('jsonwebtoken')

const app = require('../app')
const userModel = require('../models/user')
const Candidate = require('../models/candidate')
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
  linkedURL: 'https://linkedin.com/in/fulan',
  email: user.email,
  user: {}
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

describe('Candidate Tests', () => {
  before(function (done) {
    sinon.stub(scrapper, 'scrapProfile').callsFake(() => {
      return linkedInProfileData
    })
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
    Candidate
      .create({
        ...candidate,
        user: this.user
      })
      .then(candidate => {
        this.candidate = candidate
        done()
      })
      .catch(done)
  })

  after(done => clearDb.user(done))
  after(function (done) {
    sinon.restore()
    done()
  })

  describe('GET /candidate/:id/refresh', () => {
    it('should send an object with status code 200', function (done) {
      chai
        .request(app)
        .get(`/candidate/${this.candidate._id}/refresh`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('string')
          done()
        })
    })
    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubFindOneAndUpdate = sinon.stub(Candidate, 'findOneAndUpdate')
      stubFindOneAndUpdate.callsFake(() => {
        throw Error('error from stub')
      })

      chai
        .request(app)
        .get(`/candidate/${this.candidate._id}/refresh`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(500)
          expect(res.body).to.be.an('object')
          stubFindOneAndUpdate.restore()
          done()
        })
    })
  })
})
