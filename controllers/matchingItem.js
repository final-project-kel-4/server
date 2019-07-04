const axios = require('axios')
const MatchingItem = require('../models/matchingitem')
const Matching = require('../models/matching')

class MatchingItemController {
    static delete(req, res) {
        MatchingItem.findOneAndDelete({ _id: req.params.id })
            .then( async (data) => {
                await Matching.findOneAndUpdate({ items: req.params.id }, { $pull: { items: req.params.id } }, { new: true })
                res.status(200).json(data)
            })
            .catch(/* istanbul ignore next */ err => {
                res.status(500).json(err)
            })
    }
}

module.exports = MatchingItemController
