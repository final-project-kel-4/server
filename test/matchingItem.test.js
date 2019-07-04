const chai = require('chai')
const chaiHttp = require('chai-http')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const sinon = require('sinon')

const app = require('../app')
const clearDb = require('../helpers/clear')
const User = require('../models/user')
const MatchingItem = require('../models/matchingitem')

chai.use(chaiHttp)

const expect = chai.expect

const user = {
  name: 'fulan',
  email: 'fulan@gmail.com',
  password: 'qweasdzxc',
  company: 'https://linkedin.com/company/pt--tokopedia'
}

describe('Matching Tests', () => {
  before(function (done) {
    User
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
    MatchingItem
      .create({
        candidate: mongoose.Types.ObjectId()
      })
      .then(matchingItem => {
        this.matchingItem = matchingItem
        done()
      })
      .catch(done)
  })

  after(done => clearDb.all(done))
  after(done => {
    sinon.restore()
    done()
  })

  describe('Delete /matchItem/:id', () => {
    it('should send an object with status code 200', function (done) {
      chai
        .request(app)
        .delete(`/matchItem/${this.matchingItem._id}`)
        .set('Authorization', this.token)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body).to.be.an('object')
          done()
        })
    })

    it('should send error object and status code 500 when mongoose throw an error', function (done) {
      const stubDelete = sinon.stub(MatchingItem, 'findOneAndDelete')
      stubDelete.callsFake(() => {
        throw Error('stub error')
      })

      chai
        .request(app)
        .delete(`/matchItem/${this.matchingItem._id}`)
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
