const axios = require('axios')
const language = require('@google-cloud/language');
const MIN_SALIENCE = 0.2

class TextAnalyzer {
    static async analyze(text) {
        // Imports the Google Cloud client library
        // Creates a client
        const client = new language.LanguageServiceClient();

        // Prepares a document, representing the provided text
        const document = {
            content: text,
            type: 'PLAIN_TEXT',
        };

        // Detects entities in the document
        const [result] = await client.analyzeEntities({document});
        let entities = result.entities;

        entities = entities.filter(x => {
            if(x.type !== 'NUMBER' && x.salience >= 0.002) 
            {
                return true
            }
            else {
                return false
            }
        });

        entities = entities.map(item => {
            return {name: item.name, salience: item.salience}
        })

        return entities
    }
}

module.exports = TextAnalyzer