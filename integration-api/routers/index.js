// Routers definition
"use strict";
const path = require('path');
const swaggerUi = require("swagger-ui-express");
const YAML = require('yamljs');
const fs = require("fs");
const yamlString = fs.readFileSync(
  path.join(__dirname, "../swagger/index.yaml"),
  { encoding: "utf8" }
);
const swaggerDocument = YAML.parse(yamlString);
const uploadController = require(path.join(
  __dirname,
  "../controllers/uploadController.js"
));

module.exports = function (server) {
  server.route("/cities").post(uploadController.uploadCities);
  server.route("/climate").post(uploadController.uploadClimate);
  // API Swagger setup
  server.use("/api-docs", swaggerUi.serve);
  server.route("/api-docs").get(swaggerUi.setup(swaggerDocument));
};
