const Job = require('../models/job')
const TextUtility = require('../helpers/textProcessing')

class JobController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Job.find({});
            res.status(200).json(list)
        }
        catch(err) {
            console.log("ERR - Job.findAll =>\n", err);
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Job.findOne({_id: id});
            if(data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json("Job not found")
            }
        }
        catch(err) {
            console.log("ERR - Job.findOne =>\n", err);
            res.status(500).json(err)
        }
    }
    
    static async create(req, res) {
        let newData, linkedinLink = req.body.linkedin
        let created;

        //TODO: Call job scrapper
        // newData = job_scrapper();
        
        //process job descriptions (remove stop words, lowercase, duplicate, etc)
        //newData.cleanedDescription = TextUtility.cleanInput(newData.originalDescription)

        try {
            created = await Job.create(newData);
            if(created) {
                res.status(201).json(created)
            }
            else {
                throw Error("Error creating data")
            }
        }
        catch(err) {
            console.log("ERR - Job.create =>\n", err);
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Job.findOneAndDelete({_id: id});
            if(deleted) {
                res.status(201).json(created)
            }
            else {
                throw Error("Invalid ID")
            }
        }
        catch(err) {
            console.log("ERR - Job.delete =>\n", err);
            res.status(500).json(err)
        }
    }
}

module.exports = JobController