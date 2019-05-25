const LocaleCode = require('locale-code');
const axios = require('axios');
const environment = require('./environment');

exports.processRequest = async function () {

    const respond = await axios.get(`${environment.googleTtsApiUrl}?key=${process.env.googleApiKey}`);

    const voices = respond.data.voices.map(value => {

        const id = value.name;
        const nameParts = id.split("-");

        const languageCode = `${nameParts[0]}-${nameParts[1]}`;

        let language = '';
        let country = '';
        if (languageCode === 'fil-PH') {
            language = 'Filipino';
            country = 'Philippines';
        } else if (languageCode === 'nb-no') {
            language = 'Norwegian Bokmål';
            country = 'Norway';
        } else if (languageCode === 'ar-XA') {
            language = LocaleCode.getLanguageNativeName(languageCode);
            country = 'International';
        } else {
            language = LocaleCode.getLanguageNativeName(languageCode);
            country = LocaleCode.getCountryName(languageCode);
        }
        const categoryLevel = nameParts[2] === 'Wavenet' ? 'Standard' : 'Primary';

        const name = categoryLevel + '-' + nameParts[3].trim();
        const gender = value.ssmlGender;


        if (!country || !language) {
            console.log(id);
        }

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
