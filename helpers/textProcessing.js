const sw = require('stopword');
const COEFFICIENTS = require('../constants')
const Similarity = require('string-similarity');

class Utility {
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
       let score = 0.0, paramScore = 0.0
       let profileParams = []
       profileParams = Object.keys(profile)

       profileParams.forEach(param => {
           paramScore = 0.0

           if(param === 'currentPosition') {
               paramScore = Similarity.compareTwoStrings(job.title, profile[param]) * COEFFICIENTS[param]
               console.log(`\nparam: ${param} | itemScore = (${paramScore}) | Coefficient = (${COEFFICIENTS[param]}) | totalScore: ${paramScore}`);
           }
           else {
            if(typeof(profile[param]) === 'string') {
                let rawScore = Similarity.compareTwoStrings(job.cleanDescription, profile[param])
                paramScore = rawScore * COEFFICIENTS[param];
                console.log(`\nparam: ${param} | itemScore = (${rawScore}) | Coefficient = (${COEFFICIENTS[param]}) | totalScore: ${paramScore}`);
             }
             else {
                 //for param that are array of strings (work experience, recommendations)
                 let arr = profile[param]
                 let subScore = 0.0
                 arr.forEach(paramDesc => {
                     let rawScore = Similarity.compareTwoStrings(job.cleanDescription, paramDesc);
                     paramScore += rawScore
                     
                     console.log(`\nparam: ${param} | itemScore = (${rawScore}) | Coefficient = (${COEFFICIENTS[param]})`);
                 })
 
                 paramScore = (paramScore / ( arr.length * 1.0)) * COEFFICIENTS[param];
                 console.log(`\nparam (${param}) total score = ${paramScore}\n`);
             }
           }
           
           score += paramScore
        });
        
        console.log(`\n\nFINAL - SCORE = ${score}\n\n`)
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