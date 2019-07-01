const axios = require('axios')
const stringSimilarity = require('string-similarity');
const TextUtility = require('../helpers/textProcessing')
const Match = require('../models/matching')
const Job = require('../models/job')
const Candidate = require('../models/candidate')
const MatchingItem = require('../models/matchingitem')
const ObjectId = require('mongoose').Types.ObjectId

class MatchingController {
    static findAll(req, res) {
        Match.find()
            .populate({path: 'items', populate: {path: 'candidate', model: 'Candidate'}})
            .then(data => {
                if(data) {
                     res.status(200).json(data)
                }
                else {
                    res.status(404).json('Invalid Matching ID')
                }
            })
            .catch(err => {
                console.log(`ERR - MatchingController::findAll\n ${err}`);
                res.status(500).json(err)
            })
    }

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
            .catch(err => {
                console.log(`ERR - MatchingController::findOne\n ${err}`);
                res.status(500).json(err)
            })
    }

    static async create(req, res) {
        let jobId = req.body.job, job
        let candidates = req.body.candidates
        let matchingData, newMatching, promises = [], matchingItems

        try {
            // TODO - Perform the matching/comparison
            job = await Job.findOne({_id: jobId});

            if(!job) {
                throw Error('Invalid Job ID -> ' + jobId)
            }

            if(candidates && candidates.length > 0) {
                
                //calculate rank. matchingDat -> [{candidateId, score}, {candidateId, score}, ..]
                matchingData = await MatchingController.matchCandidates(jobId, candidates);

                if(!matchingData) {
                    throw Error("Error calculating scores. Please try again")
                }

                matchingData.forEach(item => {
                    promises.push(MatchingItem.create({candidate: item.candidate._id, score: item.score}))
                })
                matchingItems = await Promise.all(promises);
                
                //create the Matching model
                newMatching = await Match.create({job: jobId, items: matchingItems});

                //populate the reference attributes
                newMatching = await Match.findOne({_id: newMatching._id}).populate({path: 'items', populate: { path: 'candidate', model: 'Candidate'}}).populate('job');

                res.status(201).json(newMatching)
            }
            else {
                res.status(400).json("Please select at least one candidate!")
            }
        }
        catch(err) {
            console.log("ERR - MatchingController::create \n", err);
            res.status(500).json(err)
        }
    }

    static async matchCandidates(jobId, candidateIds) {
        let job, candidateResult = []
        let candidates, promises =[];
        let profile, score;

        try {
            job = await Job.findOne({_id: jobId});
            
            candidateIds.forEach(id => {
                promises.push(Candidate.findOne({_id: id}))
            });
    
            //get all candidate objects
            candidates = await Promise.all(promises);

            //iterates all candidates' profile and compare the similarities
            candidates.forEach(person => {
                profile = person.profile;
                score = TextUtility.compareOneCandidate(job, profile)

                candidateResult.push({candidate: person, score})
            })

            //sort the result (highest score first)
            candidateResult.sort((a,b) => {
                if(a.score > b.score) {
                    return -1
                }
                else if(a.score < b.score) {
                    return 1
                }
                else return 0
            })

            return candidateResult
        }
        catch(err) {
            console.log("ERR - MatchingController::matchCandidates \n", err)
            return null;
        }

    }

    static async recompare(req, res) {
        let matching, newMatching, matchingData, candidates = []
        let jobId
        let matchingId = req.params.id
        let promises = []
        try {
            // TODO - Perform recompare   
            // 1. Get the matching model
            matching = await Match.findOne({_id: matchingId}).populate('items');

            if(!matching) return 'Invalid ID'
            else if(matching.items && matching.items.length > 0) {
                jobId = matching.job;
                candidates = matching.items.map(x => x.candidate)

                //2. calculate rank
                matchingData = await MatchingController.matchCandidates(jobId, candidates);
                if(!matchingData) {
                    throw Error("Error calculating scores. Please try again")
                }
                
                // update the latest score
                matching.items.forEach(item => {
                    let found = matchingData.find(x => x.candidate._id.toString() === item.candidate.toString());
                    
                    console.log(found);
                    
                    promises.push(MatchingItem.findOneAndUpdate({_id: item._id}, {score: found.score}, {new: true}))
                })

                await Promise.all(promises)
                
                //populate the reference attributes
                newMatching = await Match.findOneAndUpdate({_id: matchingId}, {updatedat: new Date}, {new: true}).populate({path: 'items', populate: { path: 'candidate', model: 'Candidate'}}).populate('job');
                
                res.status(200).json(newMatching)
            }
            else {
                throw Error("")
            }
        }
        catch(err) {
            console.log("\n\nERR - Matching::recompare \n", err);
            res.status(500).json(err)
        }
    }
}

module.exports = MatchingController