const init = require('./init');
const {admin, app} = init.initHttp();

app.post('/disable', async (request, response) => {
    try {
        const idToken = request.header('Authorization').split(' ')[1];
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        if (!decodedIdToken.email_verified) {
            throw new Error('Please Verify Your Email');
        }
        await admin.auth().updateUser(decodedIdToken.uid, {
            disabled: true,
        });
        response.status(200).send();
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

exports.app = app;
