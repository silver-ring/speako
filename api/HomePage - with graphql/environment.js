const { env } = process;

const AUTH_TYPE = require('aws-appsync/lib/link/auth-link').AUTH_TYPE;

exports.googleApiKey = env.googleApiKey;
exports.googleTtsApiUrl = env.googleTtsApiUrl;

exports.graphqlApiRegion = env.graphqlApiRegion;
exports.graphqlApiUrl = env.graphqlApiUrl;
exports.graphqlApiKey = env.graphqlApiKey;

exports.graphqlAuthType = AUTH_TYPE.API_KEY;
