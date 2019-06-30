const mongoose = require('mongoose')
const Schema = mongoose.Schema

let matchingSchema = new Schema({
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, "Job is required"]
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'MatchingItem', //MatchingItem = {candidate: ID, score: Number}
        default: []
    }],
    createdat: {
        type: Date,
        default: new Date
    },
    updatedat: {
        type: Date,
        default: new Date
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Matching = mongoose.model('Matching', matchingSchema)

module.exports = Matching
