const httpHandler = require(`./http-handler`);
const jsonValidation = require('./json-validation');
const httpProcessor = require('./http-processor');

exports.handler = async (event, context) => {
    try {
        jsonValidation.validateEnvironment();
        const data = await httpProcessor.processRequest();
        return httpHandler.buildOk(data);
    } catch (exception) {
        // report errors in cloud watch
        console.log(exception);
        return httpHandler.buildBadRequest();
    }
};
