const sw = require('stopword');

class Utility {
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
        temp = temp.replace(/[^a-zA-Z0-9+# ]/g, "");

        cleaned = temp;
        return cleaned;
    }
}

module.exports = Utility