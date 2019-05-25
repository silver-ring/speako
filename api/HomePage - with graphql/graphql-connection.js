const AWSAppSyncClient = require('aws-appsync').default;
const environment = require('./environment');

exports.initConnection = async function () {
    return await new AWSAppSyncClient({
        url: environment.graphqlApiUrl,
        region: environment.graphqlApiRegion,
        auth: {
            type: environment.graphqlAuthType,
            apiKey: environment.graphqlApiKey
        },
        disableOffline: true
    }).hydrated();
};

exports.executeMutation = async function (connection, mutation, variables) {
    return await connection.mutate({mutation, variables});
};

exports.executeQuery = async function (connection, query, variables) {
    return await connection.query({query, variables});
};
