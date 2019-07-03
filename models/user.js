const mongoose = require('mongoose')
const { hash } = require('../helpers/bcrypt')
const Schema = mongoose.Schema

let userSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    validate: [{
      validator: function (val) {
        return User.findOne({ email: val })
          .then(data => {
            if (data) {
              throw "Email in use"
            }
          })
      },
    }]
  },
  password: String, 
  company: {
    type: String,
    validate: [{
      validator: function (value) {
        return /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/.test(value)
      },
      msg: "Must be valid URL format"
    }],
    required: [true, "Company LinkedIn Link is mandatory"]
  }
})

userSchema.pre('save', function (next) {
  this.password = hash(this.password)
  next()
})

let User = mongoose.model('User', userSchema)

module.exports = User
