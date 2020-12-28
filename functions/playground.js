const init = require('./init');
const {admin, app} = init.initHttp();

const textToSpeech = require('@google-cloud/text-to-speech');
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

app.post('/tts', async (request, response) => {

    let uid;
    const {text, voiceName, speed, pitch, profiles, gainDb, isSsml} = request.body;

    try {


        const idToken = request.header('Authorization').split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedIdToken.email_verified) {
            throw new Error('Please Verify Your Email');
        }

        const voiceParts = voiceName.split("-");

        const ttsRequest = {
            input: {},
            audioConfig: {
                audioEncoding: "MP3",
                pitch: pitch,
                volumeGainDb: gainDb,
                speakingRate: speed,
            },
            voice: {
                name: voiceName,
                languageCode: `${voiceParts[0]}-${voiceParts[1]}`
            }
        };

        if (isSsml) {
            ttsRequest.input = {
                ssml: text
            }
        } else {
            ttsRequest.input = {
                text: text
            }
        }

        const filteredProfiles = profiles.filter(el => el !== null || el !== '');

        if (filteredProfiles.length > 0) {
            ttsRequest.audioConfig.effectsProfileId = filteredProfiles;
        }

        const newBalance = await init.redeemMemberBalance(decodedIdToken.uid, text.length);
        uid = decodedIdToken.uid;
        const result = await textToSpeechClient.synthesizeSpeech(ttsRequest);

        let audioContent = result[0].audioContent.toString('base64');
        response.status(200).send({
            audioContent,
            newBalance
        });
    } catch (error) {
        await init.revertPoints(text.length, uid);
        if (!error) {
            response.status(400).send({message: 'unknown error'});
        }
        if (!error.message) {
            response.status(400).send({message: error});
        } else {
            response.status(400).send({message: error.message});
        }
    }
});

exports.app = app;
