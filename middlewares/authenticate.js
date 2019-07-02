const jwt = require('../helpers/jwt')
const User = require('../models/user')

module.exports = function(req, res, next) {
    if(req.headers.authorization) {
        let payload, email
        try {
            payload = jwt.verify(req.headers.authorization, res)
            if(!payload) {
                throw Error('Empty payload. Try again.')
            }
            email = payload.email
            User.findOne({email: email})
            .then(user => {
                if(user) {
                    req.user = user
                    next()
                }
                else {
                    res.status(401).json(`Invalid email`)
                }
            })
            .catch(error => {
                res.status(500).json(`Error authenticate user`)
            })
        }
        catch(error) {
            console.log(error);
            res.status(500).json(`Error. Please try again.`)
        }
    }
    else {
        res.status(401).json(`Invalid authorization token`)
    }
}
