const LocaleCode = require('locale-code');
const axios = require('axios');
const environment = require('./environment');

exports.processRequest = async function () {

    const respond = await axios.get(`${environment.googleTtsApiUrl}?key=${process.env.googleApiKey}`);

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
        voices
    };

};
