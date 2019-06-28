const Candidate = require('../models/candidate')

module.exports = function(req, res, next) {
    let id = req.params.id

    if(req.user.role === 'admin') {
        next()
    }
    else {
        Candidate.findOne({_id: id})
            .then(found => {
                if(found) {
                    if(found.user.toString() === req.user._id.toString()) {
                        next()
                    }
                    else {
                        res.status(403).json(`Forbidden to access the resource`)
                    }
                }
                else {
                    res.status(400).json(`Invalid ID`)
                }
            })
            .catch(err => {
                console.log('authorizeCandidate error ==> \n',err);
                res.status(500).json(`Error during authorization. Please try again.`)
            })
        
    }
}