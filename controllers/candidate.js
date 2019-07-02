const Candidate = require('../models/candidate')
const TextUtility = require('../helpers/textProcessing')
const scrapper = require('../helpers/linkedin-scrapper/index')

let auth = {
    email: 'prasetio017@gmail.com',
    password: 'prasetio017'
   }

class CandidateController {
    static async refresh(req, res) {
        let candidate, scrapData

        try {
            candidate = await Candidate.findOne({_id: req.params.id})

            scrapData = await scrapper.scrapProfile(candidate.linkedinURL, {auth:auth})
            scrapData = initModelData(scrapData)
            candidate = await Candidate.findOneAndUpdate({_id: req.params.id}, scrapData, {new: true});

            res.status(200).json(`Refresh for candidate with id ${req.params.id} success`)
        }
        catch(err) {
            res.status(500).json(err)
        }

    }

}

const initModelData = (rawData) => {
    let newData = {profile: {}}

    newData.name = rawData.name
    newData.photo = rawData.photo
    newData.profile.currentPosition = rawData.currentJob
    newData.profile.about = rawData.about ? TextUtility.cleanInput(rawData.about) : ""
    newData.profile.workExperience = rawData.experience.map(x => {
        let exp =""
        if(Array.isArray(x.position)){
            x.position.forEach(el=>{
                exp += (el.name +" "+ el.description+ " ")
            })
        }else{
            exp += x.name+ " "+x.description
        }
        return TextUtility.cleanInput(exp)
    })
    newData.profile.educations = rawData.education.map(x => {
        return TextUtility.cleanInput(x.field)
    })

    return newData
}

module.exports = CandidateController
