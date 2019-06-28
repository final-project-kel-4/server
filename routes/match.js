const router = require('express').Router()
const matchController = require('../controllers/matching')

router.post('/', matchController.create)
router.get('/:id', matchController.findOne)
router.post('/:id', matchController.findOne)
router.get('/:id/refresh', matchController.recompare)

module.exports = router
