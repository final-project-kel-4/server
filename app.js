require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const route = require('./routes')
const morgan = require('morgan')
const port = process.env.PORT

let app = express()

mongoose.connect("mongodb+srv://admin:admin@cluster0-ayir7.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(morgan('dev'))
app.use('/', route)

app.listen(port, () => {
  console.log(`Server listen on ${port}`);
})

module.exports = app
