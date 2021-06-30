'use strict'
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
  //  Need to Implement File size validation to prevent DDOS
const path = require('path');
const apiLog = require(path.join(__dirname, '/log'));
require(path.join(__dirname, '/boot/env.js'))();

server.use(bodyParser.json(), fileUpload(), apiLog);
const routers = require('./routers');
routers(server);

module.exports = server;
