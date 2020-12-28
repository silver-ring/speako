const init = require('./init');
const {app} = init.initHttp();
const axios = require('axios');

app.post('/', async (request, response) => {
    try {
        const {token} = request.body;
        await sendVerificationRequest(token);
        response.status(200).send();
    } catch (error) {
        console.log(error);
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

sendVerificationRequest = async (token) => {
    const secret = '6LdveKUUAAAAABH-Ywn7944j576elc9KNTc54czp';
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`;
    const result = await axios.get(url);
    if (!result.data.success) {
        throw new Error('Invalid token')
    }
}

exports.app = app;
