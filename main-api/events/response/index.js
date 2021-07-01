// Central place to define all API responses 
const path = require('path');
const Utils = require(path.join(__dirname, '../../controllers/utils.js'));
const errors = Utils.getConfig('errors');

function buildError(data) {
    let { code, message, details, log } = data;
    code = code || errors.default.code;
    message = message || errors[code].message;
    details = details || errors[code].details;
    log = log || code.concat(' ', message, ' ', details);
    return { code, message, details, log };
}

module.exports = {
    success: (req, res, data) => {
        return res.status(200).json(data);
    },
    successWrite: (req, res, data) => {
        return res.status(201).json(data);
    },
    error: (req, res, data) => {
        const error = buildError(data);
        req.apiLog(req, res, error.log);
        delete error.log;
        return res.status(409).json(error);
    },
    authError: (req, res, data) => {
        const error = buildError(data);
        req.apiLog(req, res, error.log);
        delete error.log;
        return res.status(401).json(error);
    },
    validationError: (req, res, data) => {
        const error = buildError(data);
        req.apiLog(req, res, error.log);
        delete error.log;
        return res.status(422).json(error);
    }
}