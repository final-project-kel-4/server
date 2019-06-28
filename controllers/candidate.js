const Candidate = require('../models/candidate')
const TextUtility = require('../helpers/textProcessing')

class CandidateController {
    static async findAll(req, res) {
        let list;
        try {
            list = await Candidate.find({});
            res.status(200).json(list)
        }
        catch(err) {
            console.log("ERR - Candidate.findAll =>\n", err);
            res.status(500).json(err)
        }
    }

    static async findOne(req, res) {
        let id = req.params.id
        let data;
        try {
            data = await Candidate.findOne({_id: id});
            if(data) {
                res.status(200).json(data)
            }
            else {
                res.status(404).json("Candidate not found")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.findOne =>\n", err);
            res.status(500).json(err)
        }
    }
    
    static async create(req, res) {
        let newData, linkedinLink = req.body.linkedin
        let created;

        /**
         * property profile of Candidate must have following attributes:
            currentPosition: "",
            about: "",
            workExperience: ["", ""],
            recommendations: ["", ""]
            educations: ["", ""] (optional params)
        */

        // TODO: will call scrapping
        // newData = scrapping_method();
        // newData.profile = helper.cleanCandidateProfile(newData.profile)

        try {
            created = await Candidate.create(newData);
            if(created) {
                res.status(201).json(created)
            }
            else {
                throw Error("Error creating data")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.create =>\n", err);
            res.status(500).json(err)
        }
    }

    static async delete(req, res) {
        let id = req.params.id
        let deleted;

        try {
            deleted = await Candidate.findOneAndDelete({_id: id});
            if(deleted) {
                res.status(201).json(created)
            }
            else {
                throw Error("Invalid ID")
            }
        }
        catch(err) {
            console.log("ERR - Candidate.delete =>\n", err);
            res.status(500).json(err)
        }
    }
}

module.exports = CandidateController