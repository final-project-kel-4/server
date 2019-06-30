const router = require('express').Router()
const matchController = require('../controllers/matching')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.get('/', matchController.findAll)
router.post('/', matchController.create)
router.get('/:id', matchController.findOne)
router.get('/:id/refresh', matchController.recompare)

module.exports = router

//create end point addcandidate