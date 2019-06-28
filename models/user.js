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
})

userSchema.pre('save', function (next) {
  this.password = hash(this.password)
  next()
})

let User = mongoose.model('User', userSchema)

module.exports = User
