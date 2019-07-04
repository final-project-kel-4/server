require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const route = require('./routes')
const morgan = require('morgan')
const port = process.env.PORT

let app = express()

/* istanbul ignore else */
if(process.env.NODE_ENV==="_test"){
  mongoose.connect("mongodb://localhost:27017/final_project_test", { useNewUrlParser: true })
}else{
  mongoose.connect("mongodb+srv://admin:admin@cluster0-ayir7.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
}

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use(morgan('dev'))
app.use('/', route)

app.listen(port, () => {
  console.log(`Server listen on ${port}`);
})

module.exports = app
