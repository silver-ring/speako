const graphqlTemplate = require('./graphql-template');
const graphqlConnection = require('./graphql-connection');

exports.listImpressions = async function (connection) {
    const variables = {
        pk: 'impression'
    };
    const result = await graphqlConnection.executeQuery(connection, graphqlTemplate.listImpressionsQuery, variables);
    return result.data.listImpressions.items;
};
