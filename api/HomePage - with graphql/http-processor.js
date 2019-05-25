const LocaleCode = require('locale-code');
const randomNames = require('node-random-name');
const axios = require('axios');
const graphqlOperations = require('./graphql-operations');
const environment = require('./environment');


exports.processRequest = async function (connection) {

    const respond = await axios.get(`${environment.googleTtsApiUrl}?key=${process.env.googleApiKey}`);

    const impressionsResult = await graphqlOperations.listImpressions(connection);

    const impressions = {};

    impressionsResult.map(value => {
        impressions[value.sk] = {count: value.count};
    });

    const voices = respond.data.voices.map(value => {

        const id = value.name;
        const nameParts = id.split("-");

        const languageCode = `${nameParts[0]}-${nameParts[1]}`;

        const language = LocaleCode.getLanguageNativeName(languageCode);
        const country = LocaleCode.getCountryName(languageCode);
        const name = nameParts[3].trim();
        const gender = value.ssmlGender;

        return {
            id,
            language,
            country,
            gender,
            name,
        }
    });

    return {
        impressions,
        voices
    };

};
