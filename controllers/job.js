const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')
const { scrapJobByUrl } = require('../helpers/linkedin-scrapper')

class JobController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Job.find({});
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
                res.status(200).json(data)
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
        let created, scrapJobData;
        scrapJobData = await scrapJobByUrl(linkedinLink);

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
                res.status(201).json(created)
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
        
        data.title = scrapData.jobTitle
        data.company = scrapData.company
        data.rawHtml = scrapData.rawHtml
        data.originalDescription = scrapData.rawText
        data.cleanDescription = TextUtility.cleanInput(scrapData.rawText);

        return data
    }
}

module.exports = JobController