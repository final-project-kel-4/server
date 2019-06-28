const mongoose = require('mongoose')
const Schema = mongoose.Schema

let candidateSchema = new Schema({
    firstname: String,
    lastname: {
        type: String,
        required: [true, 'Last name is required']
    },
    /**
     * profile will have object with several paramaters :
     * 
     * profile: {
     *      currentPosition: "",
     *      about: "",
     *      workExperience: ["", ""],
     *      recommendations: ["", ""]
     *      educations: ["", ""] (optional params)
     * }
     */
    profile: {
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
    phone: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: true,
        validate: [{
            validator: function (val) {
            var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
            return emailRegex.test(email.text);     
            },
            msg: 'Must be valid email format!'
        }]
    },
    score: {
        type: Number,
        default: 0.0,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Candidate = mongoose.model('Candidate', candidateSchema)

module.exports = Candidate
