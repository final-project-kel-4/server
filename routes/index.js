const router = require('express').Router()
const user = require('./user')
const match = require('./match')
const matchItem = require('./matchItem')
const candidate = require('./candidate')
const job = require('./job')

router.use('/user', user)
router.use('/candidate', candidate)
router.use('/match', match)
router.use('/matchItem', matchItem)
router.use('/job', job)

module.exports = router
