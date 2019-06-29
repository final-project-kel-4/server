const router = require('express').Router()
const jobController = require('../controllers/job')
const authorizeJob = require('../middlewares/authorizeJob')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)

router.get('/', jobController.findAll)
router.get('/:id', jobController.findOne)
router.post('/', jobController.create)
router.delete('/:id', authorizeJob, jobController.delete)

module.exports = router
