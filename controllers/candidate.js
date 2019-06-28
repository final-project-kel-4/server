const Candidate = require('../models/candidate')

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
        let newData = req.body
        let created;

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