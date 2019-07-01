const mongoose = require('mongoose')
const Schema = mongoose.Schema

let candidateSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
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
    /**
     * entities object will contain same attributes as profile:
     *  profile: {
     *      currentPosition: [],
     *      about: [],
     *      workExperience: [ [], ... ],
     *      recommendations: [ [], ... ],
     *      educations: [ [], ...]
     *  }
     */
    entities: {
        type: Object,
        default: {}
    },
    originalProfile: {
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
        validate: [{
            validator: function (val) {
                var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                return emailRegex.test(val);
            },
            msg: 'Must be valid email format!'
        }]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

let Candidate = mongoose.model('Candidate', candidateSchema)

module.exports = Candidate
