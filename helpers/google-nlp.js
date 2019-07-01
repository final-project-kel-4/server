const axios = require('axios')
const language = require('@google-cloud/language');

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
        const [resultEntitySentiment] = await client.analyzeSentiment ({document});
        const entities = result.entities;
        console.log('Entities...', entities);

        console.log('Entities Sentiment: ')
        console.log(resultEntitySentiment);

        return entities
    }
}

module.exports = TextAnalyzer