const Candidate = require('../models/candidate')
const TextUtility = require('../helpers/textProcessing')
const scrapper = require('../helpers/linkedin-scrapper/index')
const GoogleNLP = require('../helpers/google-nlp')

const auth = {
    email: process.env.LINKEDIN_EMAIL,
    password: process.env.LINKEDIN_PASSWORD
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

const initModelData =  async (rawData) => {
    /* istanbul ignore next */
    let newData = {profile: {}, entities: {}}

    // newData.name = dummy.name
    newData.name = rawData.name
    newData.photo = rawData.photo
    newData.profile.currentPosition = rawData.currentJob
    /* istanbul ignore if */
    if (rawData.about) {
        newData.profile.about = TextUtility.cleanInput(rawData.about)
    } else {
        rawData.about = ""
    }
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

    /* add entities attribute, which contains same attributes as profile
        entities {
            currentPosition,
            about,
            workExperience,
            recommendations,
            educations
        }
    */
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.about = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.workExperience = newData.profile.workExperience.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })/* istanbul ignore next */
    newData.entities.recommendations = newData.profile.workExperience.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })
    newData.entities.educations = newData.profile.educations.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })


    /* add entities attribute, which contains same attributes as profile
        entities {
            currentPosition,
            about,
            workExperience,
            recommendations,
            educations
        }
    */
   /* istanbul ignore next */
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.about = await GoogleNLP.analyze(newData.profile.currentPosition)
    /* istanbul ignore next */
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)
    /* istanbul ignore next */
    newData.entities.workExperience = newData.profile.workExperience.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })/* istanbul ignore next */
    newData.entities.recommendations = newData.profile.workExperience.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })/* istanbul ignore next */
    newData.entities.educations = newData.profile.educations.map( async (x) => {
        return await GoogleNLP.analyze(x)
    })
    /* istanbul ignore next */
    return newData
}

module.exports = CandidateController
