const router = require('express').Router()
const candidate = require('../controllers/candidate')
const authorizeCandidate = require('../middlewares/authorizeCandidate')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.get('/', candidate.findAll)
router.get('/:id', candidate.findOne)
router.post('/', candidate.create)
router.get('/:id/refresh', candidate.refresh)
router.delete('/:id', authorizeCandidate, candidate.delete)

module.exports = router
