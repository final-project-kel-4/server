const modelUser = require('../models/user')
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class userController {
  static signup(req, res) {
    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    modelUser.create(newUser)
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json({ err })
      })
  }

  static signin(req, res) {
    let email = ''
    if(req.body.email) email = { email: req.body.email }

    modelUser.findOne(email)
      .then(userFound => {
        if (userFound) {
          if (compare(req.body.password, userFound.password)) {
            let token = sign({ _id: userFound._id, name: userFound.name, email: userFound.email })
            res.status(200).json({ token })
          } else {
            res.status(400).json({ msg: "Bad request" })
          }
        } else {
          res.status(400).json({ msg: "Bad request" })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = userController
