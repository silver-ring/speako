exports.lambdaHandler = async (event, context) => {
    try {

        console.log(event.httpMethod);

        if (event.httpMethod === 'OPTIONS') {
            return {
                headers: {
                    "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                    "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                    "Access-Control-Allow-Headers": "content-type",
                },
                statusCode: 200,
            }
        }

        const request = JSON.parse(event.body.toString());

        if (request.text >= 1000) {
            throw("maximum character exceeded");
        }

        const idArr = request.languageSelection.split("-");

        const json = {
            input: {
                text: request.text
            },
            voice: {
                name: request.languageSelection,
                languageCode: `${idArr[0]}-${idArr[1]}`
            },
            audioConfig: {
                audioEncoding: "MP3"
            }
        };

        const axios = require('axios');
        const response = await axios.post(`https://texttospeech.googleapis.com/v1/text:synthesize?fields=audioContent&key=${process.env.googleApiKey}`, json);

        const data = {
            audioContent: response.data.audioContent
        };

        return {
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
            },
            statusCode: 200,
            body: JSON.stringify(data)
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};
