const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')
const scrapper = require('../helpers/linkedin-scrapper/index')
const Matching = require('../models/matching')
const modelCandidate = require('../models/candidate')
const modelMatchingItem = require('../models/matchingitem')
const modelMatching = require('../models/matching')
const GoogleNLP = require('../helpers/google-nlp')

let auth = {
    email: process.env.LINKEDIN_EMAIL,
    password: process.env.LINKEDIN_PASSWORD
}

class JobController {
    static async findAll(req, res) {
        let list, resultScrapCompany, newData, created, matching;
        let jobCreate = []

        try {
            list = await Job.find({ user: req.user._id });
            console.log('list', list);

            if (list.length === 0) {
                console.log("Masuk");

                resultScrapCompany = await scrapper.scrapCompany(req.user.company, { auth: auth })
            }
            console.log(resultScrapCompany);
            if (resultScrapCompany) {

                jobCreate = await Promise.all(resultScrapCompany.map(async company => {
                    
                    newData = await JobController.initJobData(company)
                    // newData.linkedinURL = linkedinLink;
                    newData.user = req.user._id;

                    created = await Job.create(newData)

                    //create Matching object (1 to 1 with Job)
                    matching = await Matching.create({ job: created._id, user: req.user, items: [] })

                    return created
                }))
                console.log(jobCreate);
                
                res.status(200).json(jobCreate)
            }else{
                res.status(200).json(list)
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Job.findOne({ _id: id });
            let matching = await Matching.findOne({ job: data._id })
            res.status(200).json({ ...data.toObject(), matching: matching._id })
        }
        catch (err) {
            res.status(500).json(err)
        }
    }

    static async create(req, res) {

        let newData, linkedinLink = req.body.linkedin
        let created, scrapJobData
        let matching;

        try {
            scrapJobData = await scrapper.scrapJob(linkedinLink);
            if (!scrapJobData) {
                throw Error('Error scrapping the job link. Please try again.')
            }
            console.log(scrapJobData);
            //init Job model data
            newData = await JobController.initJobData(scrapJobData)
            newData.linkedinURL = linkedinLink;
            newData.user = req.user._id;

            created = await Job.create(newData);

            //create Matching object (1 to 1 with Job)
            matching = await Matching.create({ job: created._id, user: req.user, items: [] })

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

    static async initJobData(scrapData) {
        let data = {}

        data.title = scrapData.title
        data.company = scrapData.company
        data.rawHtml = scrapData.description.html
        data.originalDescription = scrapData.description.text
        data.cleanDescription = TextUtility.cleanInput(scrapData.description.text);

        //add entities extraction for each Job creation, using clened job description
        data.entities = await GoogleNLP.analyze(data.cleanDescription)

        return data
    }

    static async addCandidate(req, res) {
        let counter = 0
        let candidates = req.body.linkedin.split('\n')
        let matching = await modelMatching.findOne({ job: req.body.jobId }).populate({ path: 'items', populate: { path: 'candidate', model: 'Candidate' } });

        await candidates.map(async el => {
            let candidate = await modelCandidate.findOne({ linkedinURL: el })

            //jika candidate sudah terdaftar
            if (candidate) {
                let newItem, currentItem
                currentItem = matching.items.find(x => {
                    let username = candidate.linkedinURL.substring(candidate.linkedinURL.indexOf('in/') + 3).replace(/^[/ ]*(.*?)[/ ]*$/g, '$1');
                    let newUsername = x.candidate.linkedinURL.substring(x.candidate.linkedinURL.indexOf('in/') + 3).replace(/^[/ ]*(.*?)[/ ]*$/g, '$1');

                    return username === newUsername
                });

                console.log(candidate, currentItem);

                if (!currentItem) {
                    newItem = await modelMatchingItem.create({ candidate: candidate._id })
                    await modelMatching.findOneAndUpdate({ job: req.body.jobId }, { $push: { items: newItem._id } }, { new: true })
                }
                counter += 1
            } else {
                let resultScrap = await scrapper.scrapProfile(el, { auth: auth })
                let newData = await initModelData(resultScrap)
                newData.linkedinURL = el

                let newCandidate = await modelCandidate.create(newData)
                let newItem = await modelMatchingItem.create({ candidate: newCandidate._id })

                await modelMatching.findOneAndUpdate({ job: req.body.jobId }, { $push: { items: newItem._id } }, { new: true })
                counter += 1
            }

            if (counter >= candidates.length) {
                let result = await modelMatching.findOne({ job: req.body.jobId }).populate({ path: 'items', populate: { path: 'candidate', model: 'Candidate' } });
                res.status(201).json(result)
            }
        })
    }

    static async doScrap(req, res) {
        let scrapJobData

        if(!req.user.company) {
            throw Error("Missing Company LinkedIn URL")    
        }
        scrapJobData = scrapJob(req.user.company)
    }
}

const scrapJob = async function(link) {
    let scrapData = []
    try {
        scrapData = await scrapper.scrapCompany(link);
        console.log(scrapData);

    }
    catch(err) {
        console.log("ERR - Job.doSCrap -- \n", err);
        res.status(500).json(err)
    }
}

const initModelData = async (rawData) => {
    let newData = { profile: {}, entities: {} }

    newData.name = rawData.name
    newData.photo = rawData.photo
    newData.profile.currentPosition = rawData.currentJob
    newData.profile.about = rawData.about ? TextUtility.cleanInput(rawData.about) : ""
    newData.profile.workExperience = rawData.experience.map(x => {
        let exp = ""
        if (Array.isArray(x.position)) {
            x.position.forEach(el => {
                exp += (el.name + " " + el.description + " ")
            })
        } else {
            exp += x.position.name + " " + x.position.description
        }

        return TextUtility.cleanInput(exp)
    })
    newData.profile.educations = rawData.education.map(x => {
        return TextUtility.cleanInput(x.field)
    })

    let skills = []
    rawData.skill.forEach(x => {
        console.log(Object.values(x)[0]);
        skills = [...skills, ...Object.values(x)[0]]
    });

    newData.profile.skill = skills.map(x => {
        return { name: x.toLowerCase() }
    })

    //get the NLP result / entities for candidate attributes
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.about = await GoogleNLP.analyze(newData.profile.currentPosition)
    newData.entities.currentPosition = await GoogleNLP.analyze(newData.profile.currentPosition)

    if (newData.profile.workExperience) {

        result = await GoogleNLP.analyze(newData.profile.workExperience.join(' '))
        newData.entities.experience = result
    }

    if (newData.profile.educations) {
        let result

        result = await GoogleNLP.analyze(newData.profile.educations.join(' '))
        newData.entities.educations = result
    }

    if (newData.profile.skill) {
        newData.entities.skill = newData.profile.skill
    }

    return newData
}

module.exports = JobController
