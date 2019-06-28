const mongoose = require('mongoose')
const Schema = mongoose.Schema

let jobSchema = new Schema({
    title: {
        type: String,
        required: [true, "Job title/position is required"]
    },
    rawDescription: {
        type: String,
        required: [true, 'Raw Job description is required']
    },
    cleanDescription: {
        type: String
    },
    score: {
        type: Number,
        default: 0.0
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Job = mongoose.model('Job', jobSchema)

module.exports = Job
