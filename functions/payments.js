const init = require('./init');
const {app} = init.initHttp();
const crypto = require('crypto');
const Serialize = require('php-serialize');
const {public_key} = require('./payment-gateway-key.json');

app.post('/webhooks', async (request, response) => {
    try {
        const body = request.body;
        if (!validateWebhook(body)) {
            console.log('WEBHOOK_NOT_VERIFIED')
            console.log(body);
            response.sendStatus(403);
        } else {
            console.log('valid checkout request');
        }
        if (body.alert_name === 'payment_succeeded') {
            await doPayment(body);
        }
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

exports.app = app;

validateWebhook = (jsonObj) => {
    // Grab p_signature
    const mySig = Buffer.from(jsonObj.p_signature, 'base64');
    // Remove p_signature from object - not included in array of fields used in verification.
    delete jsonObj.p_signature;
    // Serialise remaining fields of jsonObj
    const serialized = Serialize.serialize(jsonObj);
    // verify the serialized array against the signature using SHA1 with your public key.
    const verifier = crypto.createVerify('sha1');
    verifier.update(serialized);
    verifier.end();
    return verifier.verify(public_key, mySig);
}

doPayment = async (body) => {
    const {passthrough, product_id, quantity} = body;
    let givenPoints = 0
    const basicPackageId = '593760';
    const extraPackageId = '593767';
    const superPackageId = '593769';
    const testPackageId = '593822';
    switch (product_id) {
        case basicPackageId:
            givenPoints = 10000;
            break;
        case extraPackageId:
            givenPoints = 100000 + 10000;
            break;
        case superPackageId:
            givenPoints = 1000000 + 200000;
            break;
        case testPackageId:
            givenPoints = 1;
            break;
    }
    const points = quantity * givenPoints;
    const res = await init.rechargeMemberBalance(points, body);
    console.log('recharge success');
    console.log('new balance:' + res.newBalance);
    console.log('old balance:' + res.oldBalance);
    console.log('order quantity:' + quantity);
    console.log('give points:' + givenPoints);
    console.log('total points:' + res.points);
    console.log('customer id:' + passthrough);
}
