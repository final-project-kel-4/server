const router = require('express').Router()
const jobController = require('../controllers/job')
const authorizeJob = require('../middlewares/authorizeJob')

router.get('/', jobController.findAll)
router.get('/:id', jobController.findOne)
router.post('/', jobController.create)
router.delete('/', authorizeJob, jobController.create)

module.exports = router
