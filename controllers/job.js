const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')
const scrapper = require('../helpers/linkedin-scrapper/index')
const Matching = require('../models/matching')
const modelCandidate = require('../models/candidate')
const modelMatchingItem = require('../models/matchingitem')
const modelMatching = require('../models/matching')

let auth = {
    email: 'prasetio017@gmail.com',
    password: 'prasetio017'
   }

class JobController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Job.find({user: req.user._id});
            res.status(200).json(list)
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Job.findOne({ _id: id });
            let matching = await Matching.findOne({job: data._id })
            res.status(200).json({...data.toObject(), matching: matching._id})
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    static async create(req, res) {

        let newData, linkedinLink = req.body.linkedin
        let created, scrapJobData
        let matching;
        scrapJobData = await scrapper.scrapJob(linkedinLink);

        try {
            if(!scrapJobData) {
                throw Error('Error scrapping the job link. Please try again.')
            }
            //init Job model data
            newData = JobController.initJobData(scrapJobData)
            newData.linkedinURL = linkedinLink;
            newData.user = req.user._id;

            created = await Job.create(newData);

            //create Matching object (1 to 1 with Job)
            matching = await Matching.create({job: created._id, user: req.user, items: []})

            res.status(201).json(created)
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Job.findOneAndDelete({ _id: id });
            res.status(201).json(deleted)
        }
        catch (err) {
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
        let counter = 0
        let candidates = req.body.linkedin.split('\n')
        let matching = await modelMatching.findOne({job:req.body.jobId}).populate({path:'items', populate: {path: 'candidate', model: 'Candidate'}});

        await candidates.map(async el=>{
            let candidate = await modelCandidate.findOne({linkedinURL: el})

            //jika candidate sudah terdaftar
            if(candidate){
                let newItem, currentItem
                currentItem = matching.items.find(x => {
                    let username = candidate.linkedinURL.substring(candidate.linkedinURL.indexOf('in/')+3).replace(/^[/ ]*(.*?)[/ ]*$/g, '$1');
                    let newUsername = candidate.linkedinURL.substring(el.indexOf('in/')+3).replace(/^[/ ]*(.*?)[/ ]*$/g, '$1');

                    return username === newUsername
                });

                if(!currentItem) {
                    newItem = await modelMatchingItem.create({candidate: candidate._id})
                    await modelMatching.findOneAndUpdate({job: req.body.jobId}, {$push: {items: newItem._id}}, {new:true})
                }
                counter+=1
            }else{
                let resultScrap = await scrapper.scrapProfile(el, {auth:auth})
                let newData = initModelData(resultScrap)

                newData.linkedinURL = el

                let newCandidate = await modelCandidate.create(newData)
                let newItem = await modelMatchingItem.create({candidate: newCandidate._id})

                await modelMatching.findOneAndUpdate({job: req.body.jobId}, {$push: {items: newItem._id}}, {new:true})
                counter+=1
            }

            if(counter>=candidates.length) {
                let result = await modelMatching.findOne({job: req.body.jobId}).populate({path:'items', populate: {path: 'candidate', model: 'Candidate'}});
                res.status(201).json(result)
            }
        })
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

module.exports = JobController
