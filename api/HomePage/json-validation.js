const jsonSchema = require('./json-schema');

exports.validateEnvironment = function () {
    exports.validateSchema(jsonSchema.env, process.env);
};

exports.validateRequestBody = function (obj) {
    exports.validateSchema(jsonSchema.request, obj);
};

exports.validateSchema = function (schema, obj) {
    const validationErrors = schema.validate(obj);
    if (validationErrors.length !== 0) {
        const errorsMessages = validationErrors.map(validationError => validationError.message);
        throw(errorsMessages);
    }
};
