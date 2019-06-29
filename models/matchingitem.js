const mongoose = require('mongoose')
const Schema = mongoose.Schema

let matchingItemSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    candidate: {
        type: Schema.Types.ObjectId,
        required: [true, "Candidate is required"]
    },
    score: {
        type: Number,
        default: 0.0
    }
})

let MatchingItem = mongoose.model('MatchingItem', matchingItemSchema)

module.exports = MatchingItem
