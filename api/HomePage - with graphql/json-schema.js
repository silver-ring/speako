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
    },
    graphqlApiKey: {
        type: String,
        required: true
    },
    graphqlApiRegion: {
        type: String,
        required: true
    },
    graphqlApiUrl: {
        type: String,
        required: true
    }
});
