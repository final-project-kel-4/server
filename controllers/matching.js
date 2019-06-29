const axios = require('axios')
const stringSimilarity = require('string-similarity');
const TextUtility = require('../helpers/textProcessing')
const Match = require('../models/matching')
const Job = require('../models/job')
const Candidate = require('../models/candidate')
const MatchingItem = require('../models/matchingitem')

class Matching {
    static findOne(req, res) {
        Match.findOne({_id: req.params.id})
            .populate({path: 'items', populate: {path: 'candidate', model: 'Candidate'}})
            .then(data => {
                if(data) {
                     res.status(200).json(data)
                }
                else {
                    res.status(404).json('Invalid Matching ID')
                }
            })
    }

    static async create(req, res) {
        let job = req.body.job
        let candidates = req.body.candidates
        let matchingData, promises = [], matchingItems = []

        try {
            // TODO - Perform the matching/comparison   
            // 1. Get the Job model
            job = await Job.findOne({_id: job});

            if(candidates && candidates.length > 0) {
                req.body.candidates.forEach(candidateId => {
                    promises.push(Candidate.findOne({_id: candidateId}))
                });

                candidates = await Promise.all(promises)

                //TODO: check if candidateID is valid
                candidates.forEach(can => {
                    if(!can) {
                        
                    }
                    else {

                    }
                })
                // if valid, create MatchingItem, and push to matching array
                // if not valid, create Candidate -> MatchingItem -> push to matching array

                //calculate rank
                matchingData = stringSimilarity.findBestMatch(job, candidates)

                res.status(200).json(matchingData)

            }
            else {
                res.status(400).json("No candidate selected!")
            }
        }
        catch(err) {
            console.log("ERR - Matching::create \n", err);
            res.status(500).json(err)
        }
    }

    static async refreshMatching(req, res) {
        let matchingId = req.params.id
        let matchingData

        if(!id) {
            res.status(400).json("Invalid ID")
        }
        //get the latest LinkedIn scrap data
        //GET SCRAP

        //re-calculate the existing matching data
        matchingData = await Matching.recompare(matchingId)

        if(matchingData) {
            res.status(200).json(matchingData)
        }
        else {
            if(matchingData === "Invalid ID") {
                res.status(404).json(matchingData)
            }
            else {
                res.status(500).json('')
            }
        }
    }

    static async recompare(matchingId) {
        let matching, matchingData, candidates = []

        try {
            // TODO - Perform recompare   
            // 1. Get the matching model
            matching = await Matching.findOne({_id: matchingId});

            if(!matching) return 'Invalid ID'
            else if(matching.candidates && matching.candidates.length > 0) {
                req.body.candidates.forEach(candidateId => {
                    promises.push(Candidate.findOne({_id: candidateId}))
                });
                candidates = await Promise.all(promises)

                //2. calculate rank
                matchingData = stringSimilarity.findBestMatch(job, candidates)
                return matchingData
            }
        }
        catch(err) {
            console.log("ERR - Matching::create \n", err);
        }
        finally {
            return matchingData
        }
    }
}

module.exports = Matching