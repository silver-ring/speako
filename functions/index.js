const functions = require('firebase-functions');
const playground = require('./playground');
const speech = require('./speech');
const createMember = require('./create-member');
const payments = require('./payments');
const users = require('./users');
const recaptcha = require('./recaptcha');

const defaultRuntimeOpts = {
    timeoutSeconds: 540,
    memory: '256MB'
}

exports.playground = functions.runWith(defaultRuntimeOpts).https.onRequest(playground.app);
exports.speech = functions.runWith(defaultRuntimeOpts).https.onRequest(speech.app);
exports.payments = functions.runWith(defaultRuntimeOpts).https.onRequest(payments.app);
exports.users = functions.runWith(defaultRuntimeOpts).https.onRequest(users.app);
exports.recaptcha = functions.runWith(defaultRuntimeOpts).https.onRequest(recaptcha.app);
exports.createMember = functions.runWith(defaultRuntimeOpts).auth.user().onCreate(createMember.trigger)
