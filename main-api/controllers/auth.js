// Used as express middleware to validate JWT 
// Used to generate JWT
'use strict'
const path = require('path');
const Utils = require(path.join(__dirname, 'utils.js'));
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = Utils.getConfig('auth');
const moment = require('moment');

class Service {
    constructor() {
        this.secret = process.env.jwtSecret;
    }
    createJWT(props = {}) {
        let { data, options } = props;
        data = data || {};
        options = options || config.options;
        let token = jwt.sign({
            data: data,
            exp: Math.floor(moment().add(options.validValue, options.validUnits).utc().valueOf() / 1000)
        }, this.secret);
        if (options.tokenPrefix) {
            token = options.tokenPrefix.concat(token);
        }
        return token;
    }
    authenticationJWT(authHeader = 'authorization', authCookie = 'authorization') {
        return expressJwt({
            secret: this.secret,
            algorithms: ['HS256'],
            credentialsRequired: true,
            getToken: (req) => {
                if (req.headers[authHeader] && req.headers[authHeader].split(' ')[0] === 'Bearer') {
                    return req.headers[authHeader].split(' ')[1];
                }
                if (req.cookies && req.cookies[authCookie]) {
                    return req.cookies[authCookie];
                }
            }
        });
    }
    unauthorizedError(err, req, res, next) {
        if (err) {
            if (config.error[err.name]) {
                return res.status(err.status).json(config.error[err.name]);
            }
        }
        throw err;
    }
}

module.exports = new Service();