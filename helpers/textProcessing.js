const sw = require('stopword');
const COEFFICIENTS = require('../constants')
const Similarity = require('string-similarity');

class Utility {
    static compareOneCandidate(jobDescription, profile) {
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

           if(typeof(param) !== 'string') {
               //for param that are array of strings (work experience, recommendations)
               param.forEach(paramDesc => {
                   paramScore += Similarity.compareTwoStrings(jobDescription, paramDesc) * COEFFICIENTS[param];
               })
           }
           else {
               paramScore = Similarity.compareTwoStrings(jobDescription, profile[param]) * COEFFICIENTS[param];
           }
           
           console.log(`Calculating param[${param}] - SCORE = ${paramScore}`)
           score += paramScore
       });

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