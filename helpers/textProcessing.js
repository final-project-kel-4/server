const sw = require('stopword');
const COEFFICIENTS = require('../constants')
const Similarity = require('string-similarity');

const scoreWeight = {
    currentPosition: 0.2,
    about: 0.1,
    experience: 0.3,
    educations: 0.1,
    skill: 0.3
}

class Utility {
    static compareEntities(job, profile) {
        let totalScore = 0.0, freqScore = 0.0
        let profileParams = [], jobEntities = job.entities.map(x => x.name.trim()), profileEntities
        let scoreDetails = {
            currentPosition: 0.0,
            about: 0.0,
            experience: 0.0,
            educations: 0.0,
            skill: 0.0
        }
        profileParams = Object.keys(profile)
        
        //method 2: concatenate all entities and compare similarity with job entities
        profileEntities = []
        profileParams.forEach(param => {
            profile[param].map(entity => {
                profileEntities.push(entity.name.trim())
            })

            if(param === 'currentPosition') {
                scoreDetails[param] = Similarity.compareTwoStrings(job.title, profile[param].map(x => x.name.trim()).join(' '));
            }
            else {
                scoreDetails[param] = Similarity.compareTwoStrings(jobEntities.join(' '), profile[param].map(x => x.name.trim()).join(' '));
            }

            console.log(`param (${param}) - GoogleNLP = ${scoreDetails[param]} - weighted: ${scoreDetails[param]* scoreWeight[param]}`);
            console.log(`entities: \n${profile[param].map(x=> x.name)}\n`);
            totalScore += scoreDetails[param]* scoreWeight[param]
        })

        profileEntities = [...new Set(profileEntities)];

        // totalScore = Similarity.compareTwoStrings(jobEntities.join(' '), profileEntities.join(' '))
        console.log(`\n\nTOTAL SCORE  GoogleNLP = ${totalScore}\n\n`)

        return {total: totalScore, scoreDetails}
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
               paramScore = Similarity.compareTwoStrings(job.get("title").toLowerCase(), profile[param].toLowerCase())
                console.log(`\nparam: ${param} | itemScore = (${paramScore}) | Coefficient = (${COEFFICIENTS[param]})`);
               paramScore *= COEFFICIENTS[param]
           }
           else {
            if(typeof(profile[param]) === 'string') {
                let rawScore = Similarity.compareTwoStrings(job.cleanDescription.toLowerCase(), profile[param].toLowerCase())
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