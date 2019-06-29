require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const route = require('./routes')
const port = process.env.PORT

let app = express()

mongoose.connect('mongodb://localhost/final_project' + process.env.NODE_ENV, { useNewUrlParser: true })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/', route)

app.listen(port, () => {
  console.log(`Server listen on ${port}`);
})

module.exports = app
