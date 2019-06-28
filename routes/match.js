const router = require('express').Router()
const matchController = require('../controllers/matcher')

router.post('/rank', matchController.rankCandidates)

module.exports = router
