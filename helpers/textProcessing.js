const sw = require('stopword');
const COEFFICIENTS = require('../constants')
const Similarity = require('string-similarity');

const scoreWeight = {
    currentPosition: 0.3,
    about: 0.01,
    experience: 0.38,
    educations: 0.01,
    skill: 0.3
}

class Utility {
    static compareEntityList(jobList, profileList) {
        let score = 0.0, itemVote = 0, currentVote = 0
        jobList = jobList.entities.map(x => x.name)
        jobList.forEach(jobItem => {
            currentVote = 0.0
            profileList.forEach(profileItem => {
                let newVote = 0.0
                newVote = Similarity.compareTwoStrings(jobItem, profileItem.toLowerCase())
                // console.log('checking job item -> '+jobItem + " | profileItem = "+ profileItem + "  SCORE: " + currentVote);
                
                if(newVote > currentVote) currentVote = newVote
            })
            
            score = score <= currentVote ? currentVote : score;
            // console.log('score job item -> '+jobItem +" ===> "+ currentVote +"\n" );
        })

        // score = score / jobList.length * 1.0
        console.log("ListBased Score Profile ===> "+ score+ "\n");

        return score
    }

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

        try {
            profileParams = Object.keys(profile)
        
            //method 2: concatenate all entities and compare similarity with job entities
            profileEntities = []
            profileParams.forEach(param => {
                if(profile[param]) {
                    profile[param].map(entity => {
                        profileEntities.push(entity.name.trim())
                    })
    
                    if(param === 'currentPosition') {
                        scoreDetails[param] = Similarity.compareTwoStrings(job.title, profile[param].map(x => x.name.trim()).join(' '));
                    }
                    else {
                        // scoreDetails[param] = Similarity.compareTwoStrings(jobEntities.join(' '), profile[param].map(x => x.name.trim()).join(' '));
                        scoreDetails[param] = Utility.compareEntityList(job, profile[param].map(x => x.name.trim()));
                    }
    
                    console.log(`param (${param}) - GoogleNLP = ${scoreDetails[param]} - weighted: ${scoreDetails[param]* scoreWeight[param]}`);
                    console.log(`entities: \n${profile[param].map(x=> x.name)}\n`);
                    totalScore += scoreDetails[param]* scoreWeight[param]
                }
            })

            profileEntities = [...new Set(profileEntities)];

            console.log(`\nTOTAL SCORE  GoogleNLP = ${totalScore}`)
            console.log(`TOTAL SCORE  Job Description vs all Profile Entities = ${Similarity.compareTwoStrings(job.cleanDescription, profileEntities.join(" "))}`)
            console.log(`TOTAL SCORE  Job Entities vs all Profile Entities = ${Similarity.compareTwoStrings(jobEntities.join(' '), profileEntities.join(" "))}`)

            return {total: totalScore, scoreDetails}
        }
        catch(err) {
            console.log("ERR - Utility::compareEntities ===> \n\n", err);
            return {total: totalScore, scoreDetails}
        }
    }

    static compareProfileBased(job, profile) {
        let totalScore = 0.0
        let profileParams = [], profileEntities
        let jobEntities = job.entities.map(x => x.name).join(' ')
        let jobSentences = job.cleanDescription.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|")

        console.log('job in sentences ---- \n', jobSentences);


        let scoreDetails = {
            currentPosition: 0.0,
            about: 0.0,
            experience: 0.0,
            educations: 0.0,
            skill: 0.0
        }

        try {
            profileParams = Object.keys(profile)
        
            profileEntities = []
            profileParams.forEach(param => {
                if(profile[param]) {
                    profile[param].map(entity => {
                        profileEntities.push(entity.name.trim())
                    })
    
                    if(param === 'currentPosition') {
                        scoreDetails[param] = Similarity.compareTwoStrings(job.title, profile[param].map(x => x.name.trim()).join(' '));
                    }
                    else {
                        let profileScore = 0.0, freq = 0
                        let match = false
                        profile[param].forEach(entity => {
                            let regx = new RegExp(entity.name, "i")
                            match = regx.test(jobEntities);

                            if(match) {
                                freq++
                            }

                            console.log('profile item : '+ entity.name + " --- match => "+ match);
                        })
                    
                        profileScore = freq * 1.0 / (profile[param].length > 0 ? profile[param].length : 1)
                        scoreDetails[param] = profileScore
                    }
    
                    console.log(`\nparam (${param}) - GoogleNLP = ${scoreDetails[param]} - weighted: ${scoreDetails[param]* scoreWeight[param]}`);
                    console.log(`entities: \n${profile[param].map(x=> x.name)}\n`);
                    totalScore += scoreDetails[param] * scoreWeight[param]
                }
            })

            // join of all entities of a candidate
            profileEntities = [...new Set(profileEntities)];

            console.log(`\n\nTOTAL SCORE (profile based) = ${totalScore}\n\n`)

            return {total: totalScore, scoreDetails}
        }
        catch(err) {
            console.log("ERR - Utility::compareEntities ===> \n\n", err);
            return {total: totalScore, scoreDetails}
        }
    }

    //compare job desc as 1 string vs profile param (position ,exp) as one string each
    static compareOneCandidate(job, profile) {
        /* 
        *   jobDescription - String 
        *   profile - Object with params:
        *       currentPosition: String, coefficient
        *       about: "",
        *       workExperience: ["", ""],
        *       skill: ["", ""]
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