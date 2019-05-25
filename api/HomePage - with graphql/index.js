global.WebSocket = require('ws');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const httpHandler = require(`./http-handler`);
const graphqlConnection = require('./graphql-connection');
const jsonValidation = require('./json-validation');
const httpProcessor = require('./http-processor');

exports.handler = async (event, context) => {
    try {
        jsonValidation.validateEnvironment();
        const connection = await graphqlConnection.initConnection();
        const data = await httpProcessor.processRequest(connection);
        return httpHandler.buildOk(data);
    } catch (exception) {
        // report errors in cloud watch
        console.log(exception);
        return httpHandler.buildBadRequest();
    }
};
