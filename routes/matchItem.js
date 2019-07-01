const router = require('express').Router()
const matchItemController = require('../controllers/matchingItem')
const authenticate = require('../middlewares/authenticate')

router.use('/', authenticate)

router.delete('/:id', matchItemController.delete)

module.exports = router
