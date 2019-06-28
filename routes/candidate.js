const router = require('express').Router()
const candidate = require('../controllers/candidate')
const authorizeCandidate = require('../middlewares/authorizeCandidate')

router.get('/', candidate.findAll)
router.get('/:id', candidate.findOne)
router.post('/', candidate.create)
router.delete('/', authorizeCandidate, candidate.create)

module.exports = router
