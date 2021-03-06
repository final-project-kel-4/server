const TextUtility = require('../helpers/textProcessing')
const scoreSort = require('../helpers/sort')
const Match = require('../models/matching')
const Job = require('../models/job')
const Candidate = require('../models/candidate')
const MatchingItem = require('../models/matchingitem')

class MatchingController {
    static findOne(req, res) {
        Match.findOne({ _id: req.params.id })
            .populate({ path: 'items', populate: { path: 'candidate', model: 'Candidate' } })
            .then(data => {
                if (data) {
                    res.status(200).json(data)
                }
                else {
                    res.status(404).json('Invalid Matching ID')
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

    static async matchCandidates(jobId, candidateIds) {
        let job, candidateResult = []
        let candidates, promises =[];
        let profile, scoreGoogle = 0.0, score = {similarity: 0.0, google: 0.0};

        try {
            job = await Job.findOne({_id: jobId});
            candidateIds.forEach(id => {
                promises.push(Candidate.findOne({_id: id}))
            });

            //get all candidate objects
            candidates = await Promise.all(promises);

            console.log("Comparing Job:\n", job.title);
            console.log(job.originalDescription);

            //iterates all candidates' profile and compare the similarities
            candidates.forEach(person => {
                profile = person.profile;
                //method 1 = compare job desc as 1 string vs each profile param as 1 string
                // score.similarity = TextUtility.compareOneCandidate(job, profile)

                //method 2: compare each word in profile entities
                scoreGoogle = TextUtility.compareEntities(job, person.entities)

                // method 3: get similarity of each tag in profile params, vs the whole job desc. If exist, vote as 100%
                // scoreGoogle = TextUtility.compareProfileBased(job, person.entities)


                score.total = scoreGoogle.total
                score.details = scoreGoogle.scoreDetails

                console.log(`score of candidate (${person.name}) = `,score,"\n\n");
                candidateResult.push({candidate: person, score: score.total, scoreDetails: scoreGoogle.scoreDetails})
            })

            //sort the result (highest score first)
            scoreSort(candidateResult)

            return candidateResult
        } catch(err) {
            /* istanbul ignore next */
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
            matching = await Match.findOne({ _id: matchingId }).populate('items');
            /* istanbul ignore next */
            if (!matching) new Error('Invalid ID')
            else if (matching.items && matching.items.length > 0) {
                jobId = matching.job;
                candidates = matching.items.map(x => x.candidate)

                //2. calculate rank
                matchingData = await MatchingController.matchCandidates(jobId, candidates);

                // update the latest score
                matching.items.forEach(item => {
                    let found = matchingData.find(x => x.candidate._id.toString() === item.candidate.toString());

                    promises.push(MatchingItem.findOneAndUpdate({ _id: item._id }, { score: found.score, scoreDetails: found.scoreDetails }, { new: true }))

                })

                await Promise.all(promises)
                //populate the reference attributes
                newMatching = await Match.findOneAndUpdate({ _id: matchingId }, { updatedat: new Date }, { new: true }).populate({ path: 'items', populate: { path: 'candidate', model: 'Candidate' } }).populate('job');

                res.status(200).json(newMatching)
            }
        }
        catch (err) {
            res.status(500).json(err)
        }
    }
}

module.exports = MatchingController
