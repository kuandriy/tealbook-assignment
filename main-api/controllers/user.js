// Mock users service
'use strict';
const path = require('path');
const AppEvents = require(path.join(__dirname, '../events'));
const Joi = require('@hapi/joi');
const crypto = require('crypto');
const AuthService = require(path.join(__dirname, 'auth.js'));
const moment = require('moment');

class Service {
    constructor() {
        this.health = this.healthCheck.bind(this);
        this.login = this.login.bind(this);
    }
    // Login will generate JWT for any email and password
    async login(req, res) {
        const data = { ...req.body };

        // Input validation
        const loginSchema = Joi.object().options({ abortEarly: false }).keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        });

        let { error } = loginSchema.validate(data);

        if (error) {
            return AppEvents.emit('validationError', req, res, { log: error, details: error, code: "901" });
        }

        // use it to find user by email and password hash, not implemented
        const passwordHash = crypto.createHmac('sha256', process.env.jwtSecret)
            .update(data.password)
            .digest('hex');

        try {
            const user = {
                jwt: AuthService.createJWT({
                    data: {
                        id: 1,
                        name: 'Andriy',
                        email: data.email
                    },
                    options: {
                        validValue: 9,
                        validUnits: "hours"
                    }
                })
            };
            return AppEvents.emit('success', req, res, user);
        } catch (error) {
            return AppEvents.emit('authError', req, res, { log: error, code: "203" });
        }
        finally {
            // release db connection in real API
        }
    }
    // Api health check
    healthCheck(req, res) {
        const response = {
            status: 'pass',
            time: moment().format()
        }
        return AppEvents.emit('success', req, res, response);
    }
}
module.exports = new Service();



