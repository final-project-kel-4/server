const router = require('express').Router()
const candidate = require('../controllers/candidate')
const authorizeCandidate = require('../middlewares/authorizeCandidate')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.get('/', candidate.findAll)
router.get('/:id', candidate.findOne)
router.post('/', candidate.create)
router.delete('/:id', authorizeCandidate, candidate.create)

module.exports = router
