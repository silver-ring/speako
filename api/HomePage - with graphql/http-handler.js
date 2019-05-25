exports.parseRequestBody = function (event) {
    exports.validateRequest(event.body);
    return JSON.parse(event.body.toString());
};

exports.validateRequest = function (requestBody) {
    if (requestBody == null || requestBody === '') {
        throw('Request is empty, expected a JSON object');
    }
};

exports.buildBadRequest = function () {
    const data = [];
    const badRequestResponse = 400;
    return exports.buildResponse(badRequestResponse, data);
};

exports.buildOk = function (data) {
    const okResponse = 200;
    return exports.buildResponse(okResponse, data);
};

exports.buildResponse = function (statusCode, data) {
    return {
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true // Required for cookies, authorization headers with HTTPS
        },
        statusCode,
        body: JSON.stringify(data)
    };
};
