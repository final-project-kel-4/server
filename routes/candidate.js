const router = require('express').Router()
const candidate = require('../controllers/candidate')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.get('/:id/refresh', candidate.refresh)

module.exports = router
