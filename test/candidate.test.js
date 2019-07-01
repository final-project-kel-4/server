// const chai = require('chai')
// const chaiHttp = require('chai-http')

// const app = require('../app')
// const userModel = require('../models/user')
// const clearDb = require('../helpers/clear')

// const expect = chai.expect

// chai.use(chaiHttp)

// const user = {
//   name: 'fulan',
//   email: 'fulan@gmail.com',
//   password: 'qweasdzxc'
// }

// const candidate = {

// }

// describe('Candidate Tests', () => {
//   before(function (done) {
//     userModel
//       .create(user)
//       .then(user => {
//         this.user = user
//         this.token = jwt.sign({
//           _id: this.user._id,
//           email: this.user.email
//         }, process.env.SECRET_JWT)
//         done()
//       })
//       .catch(done)
//   })

//   before(function (done) {
//     candidateModel
//       .create(candidate)
//       .then(candidate => {
//         this.candidate = candidate
//         done()
//       })
//       .catch(done)
//   })

//   after(done => clearDb.user(done))
//   after(done => clearDb.candidate(done))

//   describe('GET /candidate', () => {
//     it('should send an object with 200 status code', function (done) {
//       chai
//       .request(app)
//       .get('/candidate')
//       .set('Authorization', this.token)
//       .end((err, res) => {
//         expect(err).to.be.null
//         expect(res).to.have.status(200)
//         expect(res.body).ro.be.an('array')
//         done()
//       })
//     })
//   })

//   describe('GET /candidate/:id', () => {
//     it('should send an object with 200 status code', function (done) {
//       chai
//       .request(app)
//       .get(`/candidate/${this.candidate._id}`)
//       .set('Authorization', this.token)
//       .end((err, res) => {
//         expect(err).to.be.null
//         expect(res).to.have.status(200)
//         expect(res.body).ro.be.an('object')
//         done()
//       })
//     })
//   })

//   describe('DELETE /candidate/:id', () => {
//     it('should send an object with 201 status code', function (done) {
//       chai
//       .request(app)
//       .delete(`/candidate/${this.canddidate._id}`)
//       .send()
//       .end((err, res) => {
//         expect(err).to.be.null
//         expect(res).to.have.status(201)
//         expect(res.body).ro.be.an('object')
//         done()
//       })
//     })
//   })
// })
