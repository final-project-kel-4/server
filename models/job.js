const mongoose = require('mongoose')
const Schema = mongoose.Schema

let jobSchema = new Schema({
    title: {
        type: String,
        required: [true, "Job title/position is required"]
    },
    linkedinURL: {
        type: String,
        validate: {
            validator: function(value) {
                return /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/.test(value)
            },
            msg: 'Must be valid URL'
        }
    },
    originalDescription: {
        type: String,
        required: [true, 'Origin Job description is required']
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
