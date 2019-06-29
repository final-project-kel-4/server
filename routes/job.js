const router = require('express').Router()
const jobController = require('../controllers/job')
const authorizeJob = require('../middlewares/authorizeJob')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.get('/', authenticate, jobController.findAll)
router.get('/:id', jobController.findOne)
router.post('/', authenticate, jobController.create)
router.delete('/', authorizeJob, jobController.create)

module.exports = router
