'use strict'
const path = require('path');
// To support swagger UI
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yamlString = fs.readFileSync(path.join(__dirname, '../swagger/index.yaml'), { encoding: 'utf8' });
const swaggerDocument = YAML.parse(yamlString);
// BL controllers
const UserController = require(path.join(__dirname, '../controllers/user.js'));
const UploadController = require(path.join(__dirname, '../controllers/upload.js'));
const ClimateController = require(path.join(__dirname, '../controllers/climate.js'));

module.exports = function (server) {
    server.route('/login').post(UserController.login);
    server.route('/upload/cities').post(UploadController.upload);
    server.route('/upload/climate').post(UploadController.upload);
    server.route('/climate/:date').get(ClimateController.climateByDate);
    // API Swagger setup
    server.use('/api-docs', swaggerUi.serve);
    server.route('/api-docs').get(swaggerUi.setup(swaggerDocument));
};