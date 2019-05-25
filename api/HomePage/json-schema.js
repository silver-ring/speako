const Schema = require('validate');

exports.request = new Schema({});

exports.env = new Schema({
    googleApiKey: {
        type: String,
        required: true
    },
    googleTtsApiUrl: {
        type: String,
        required: true
    }
});
