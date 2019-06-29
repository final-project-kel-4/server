const mongoose = require('mongoose')
const Schema = mongoose.Schema

let jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: [true, "Job title/position is required"]
    },
    company: {
        type: Object,
        default: {}
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
    rawHtml: {
        type: String
    },
    originalDescription: {
        type: String,
        required: [true, 'Origin Job description is required']
    },
    cleanDescription: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Job = mongoose.model('Job', jobSchema)

module.exports = Job
