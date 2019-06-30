const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')
const { scrapJob } = require('../helpers/linkedin-scrapper/index')
const Matching = require('../models/matching')
const modelCandidate = require('../models/candidate')
const modelMatchingItem = require('../models/matchingitem')
const modelMatching = require('../models/matching')
const {scrapProfile} = require('../helpers/linkedin-scrapper/index')

class JobController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Job.find({user: req.user._id});
            res.status(200).json(list)
        }
        catch (err) {
            console.log("ERR - Job.findAll =>\n", err);
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Job.findOne({ _id: id });
            if (data) {
                let matching = await Matching.findOne({job: data._id })
                res.status(200).json({...data.toObject(), matching: matching._id})
            }
            else {
                res.status(404).json("Job not found")
            }
        }
        catch (err) {
            console.log("ERR - Job.findOne =>\n", err);
            res.status(500).json(err)
        }
    }

    static async create(req, res) {

        let newData, linkedinLink = req.body.linkedin
        let created, scrapJobData
        let matching;
        scrapJobData = await scrapJob(linkedinLink);

        try {
            if(!scrapJobData) {
                throw Error('Error scrapping the job link. Please try again.')
            }
            //init Job model data
            newData = JobController.initJobData(scrapJobData)
            newData.linkedinURL = linkedinLink;
            newData.user = req.user._id;
            
            created = await Job.create(newData);

            if(created) {
                console.log(created);
                
                //create Matching object (1 to 1 with Job)
                matching = await Matching.create({job: created._id, user: req.user})
                console.log(matching);
                
                res.status(201).json(created)
            }
            else {
                throw Error("Error creating data")
            }
        }
        catch (err) {
            console.log("ERR - Job.create =>\n", err);
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Job.findOneAndDelete({ _id: id });
            if (deleted) {
                res.status(201).json(deleted)
            }
            else {
                throw Error("Invalid ID")
            }
        }
        catch (err) {
            console.log("ERR - Job.delete =>\n", err);
            res.status(500).json(err)
        }
    }

    static initJobData(scrapData) {
        let data = {}
        
        data.title = scrapData.title
        data.company = scrapData.company
        data.rawHtml = scrapData.description.html
        data.originalDescription = scrapData.description.text
        data.cleanDescription = TextUtility.cleanInput(scrapData.description.text);

        return data
    }

    static async addCandidate(req, res){
        let newData, linkedinLink = req.body.linkedin
        let created;

        console.log(req.body);
        
        newData = await scrapProfile(linkedinLink)
        console.log(newData);
        
        // /**
        //  * property profile of Candidate must have following attributes:
        //     currentPosition: "",
        //     about: "",
        //     workExperience: ["", ""],
        //     recommendations: ["", ""]
        //     educations: ["", ""] (optional params)
        // */

        // //preprocess DUMMY data
        // newData = initModelData(newData)
        // newData.user = req.user._id

        // try {
        //     created = await Candidate.create(newData);
        //     if(created) {
        //         res.status(201).json(created)
        //     }
        //     else {
        //         throw Error("Error creating data")
        //     }
        // }
        // catch(err) {
        //     console.log("ERR - Candidate.create =>\n", err);
        //     res.status(500).json(err)
        // }
    }
}

const initModelData = (rawData) => {
    let newData = {profile: {}}
        
    // newData.name = dummy.name
    newData.name = rawData.name
    newData.linkedinURL = rawData.linkedinLink
    newData.profile.currentPosition = rawData.profile.currentPosition
    newData.profile.about = TextUtility.cleanInput(rawData.profile.about)
    newData.profile.workExperience = rawData.profile.workExperience.map(x => {
        return TextUtility.cleanInput(x)
    })
    newData.profile.recommendations = rawData.profile.recommendations.map(x => {
        return TextUtility.cleanInput(x)
    })
    newData.profile.educations = rawData.profile.educations.map(x => {
        return TextUtility.cleanInput(x)
    })

    return newData
}

module.exports = JobController