const sw = require('stopword');
const COEFFICIENTS = require('../constants')
const Similarity = require('string-similarity');

class Utility {
    static compareEntities(job, profile) {
        let score = 0.0, paramScore = 0.0
        let profileParams = [], jobEntities = job.map(x=> x.name).join(' '), profileEntities
        profileParams = Object.keys(profile)

        /*
        profileParams.forEach(param => {
            paramScore = 0.0
            profileEntities = profile[param].map(x => x.name).join(' ')
            paramScore = Similarity.compareTwoStrings(jobEntities, profileEntities)

            console.log(`param (${param})\ndata: ${profileEntities}\n`)
            console.log('Param Score -- ', paramScore, '\n\n');
            score += paramScore
        });
        
        score = score /(profileParams.length > 0 ? profileParams.length : 1)
        */
        
        //method 2: concatenate all entities and compare similarity with job entities
        profileEntities = []
        profileParams.forEach(param => {
            profile[param].map(x => {
                profileEntities.push(x)
            })
        })
        profileEntities = [...new Set(profileEntities)];

        score = Similarity.compareTwoStrings(jobEntities, profileEntities.join(' '))

        console.log(`\n\nFINAL SCORE  GoogleNLP = ${score}\n\n`)
        return score
    }

    static compareOneCandidate(job, profile) {
        /* 
        *   jobDescription - String 
        *   profile - Object with params:
        *       currentPosition: String, coefficient
        *       about: "",
        *       workExperience: ["", ""],
        *       recommendations: ["", ""]
        *       educations: ["", ""] (optional params)
        */
       let score = 0.0, paramScore = 0.0, gScore = 0.0, gParamScore= 0.0
       let profileParams = []
       profileParams = Object.keys(profile)
       
       profileParams.forEach(param => {
           paramScore = 0.0, gParamScore = 0.0

           if(param === 'currentPosition') {
               paramScore = Similarity.compareTwoStrings(job.get("title"), profile[param])
                console.log(`\nparam: ${param} | itemScore = (${paramScore}) | Coefficient = (${COEFFICIENTS[param]})`);
               paramScore *= COEFFICIENTS[param]
           }
           else {
            if(typeof(profile[param]) === 'string') {
                let rawScore = Similarity.compareTwoStrings(job.cleanDescription, profile[param])
                console.log('==============1',rawScore, param)

                if(rawScore == NaN) rawScore = 0
                paramScore = rawScore * COEFFICIENTS[param];
                console.log(`\nparam: ${param} | itemScore = (${rawScore}) | Coefficient = (${COEFFICIENTS[param]}) | totalScore: ${paramScore}`);
             }
             else {
                 //for param that are array of strings (work experience, recommendations)
                 let arr = profile[param]
                 
                 arr.forEach(paramDesc => {
                     let rawScore = Similarity.compareTwoStrings(job.cleanDescription, paramDesc);
                     if(rawScore == NaN) rawScore = 0
                     paramScore += rawScore
                     
                     console.log(`\nparam: ${param} | itemScore = (${rawScore}) | Coefficient = (${COEFFICIENTS[param]})`);
                 })
                 
                 
                 paramScore = (paramScore / ( (arr.length > 0 ? arr.length : 1) * 1.0)) * COEFFICIENTS[param];
                 console.log(`\nparam (${param}) total score = ${paramScore}\n`);
             }
           }
           
           score += paramScore
        });
        
        console.log(`\n\nFINAL SCORE --- Text Similarity = ${score}\n\n`)
       return score
    }

    static cleanInput(input) {
        let cleaned, temp;

        //First, make all to lowercase
        temp = input.toLowerCase();

        //Remove stop words (output now is array of strings)
        temp = sw.removeStopwords(temp.split(/\s+/));
        
        //remove duplicate
        temp = [...new Set(temp)].join(' ')
        
        //put space for 2 words connected by dot (.), eg -> "decline. program" --> "decline program"
        temp = temp.replace(/([A-Za-z0-9]+)[.][^a-zA-Z0-9 /-]*([A-Za-z0-9]+)/g, "$1 $2");

        //remove any symbol excluding +, # (C++, C# are still valid)
        //temp = temp.replace(/[^a-zA-Z0-9+# ]/g, "");

        cleaned = temp;
        return cleaned;
    }
}

module.exports = Utility