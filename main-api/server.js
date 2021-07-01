'use strict'
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const path = require('path');
// Load environment vars
require(path.join(__dirname, '/boot/env.js'))();
const cors = require('cors');
const apiLog = require(path.join(__dirname, '/log'));
const AuthService = require(path.join(__dirname, '/controllers/auth.js'));
server.use(bodyParser.json({limit: '25mb'}), cors(), AuthService.authenticationJWT().unless({ path: ['/login',  /^\/upload\// , '/health', /^\/api-docs\//] }), AuthService.unauthorizedError, apiLog);
const routers = require('./routers');
routers(server);

module.exports = server;
