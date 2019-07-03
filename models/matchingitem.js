const mongoose = require('mongoose')
const Schema = mongoose.Schema

let matchingItemSchema = new Schema({
    candidate: {
        type: Schema.Types.ObjectId,
        required: [true, "Candidate is required"]
    },
    score: {
        type: Object,
        default: {}
    },
    scoreDetails: {
        type: Object,
        default: {}
    }
})

let MatchingItem = mongoose.model('MatchingItem', matchingItemSchema)

module.exports = MatchingItem
