const init = require('./init');
const {admin, app} = init.initHttp();

const textToSpeech = require('@google-cloud/text-to-speech');
const textToSpeechClient = new textToSpeech.TextToSpeechClient();

app.post('/audio', async (request, response) => {
    try {
        const {audioKey} = request.body;

        const idToken = request.header('Authorization').split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedIdToken.email_verified) {
            throw new Error('Please Verify Your Email');
        }
        const baseUserDir = `users/${decodedIdToken.uid}`;
        const filePath = `${baseUserDir}/projects/audio/${audioKey}`;

        const audioFile = await admin.storage().bucket().file(filePath).download();

        if (audioFile[0].length === 0) {
            throw Error('file Not exist');
        }

        response.status(200).send({audioContent: audioFile[0]});
    } catch (error) {
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

        let audioContent = result[0].audioContent;
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
