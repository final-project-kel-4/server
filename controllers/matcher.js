const axios = require('axios')
const stringSimilarity = require('string-similarity');
const TextUtility = require('../helpers/textProcessing')

class Matcher {

    static async rankCandidates(req, res) {
        let job = req.body.job
        let candidates = req.body.candidates
        let rank = {}

        /* console.log(TextUtility.cleanInput(job));
        console.log(TextUtility.cleanInput(candidates[0]));
        console.log(TextUtility.cleanInput(candidates[1])); */

        try {
            /* rank = stringSimilarity.findBestMatch(job, candidates);
            if(!rank) {
                rank = []
            } 

            */
           res.status(200).json(rank)
        }
        catch(err) {
            console.log("Ranking error: ", err);
            res.status(500).json(err)
        }
    }
}

module.exports = Matcher