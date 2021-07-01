"use strict";
// Bulk upload of Cities and Climate data
const path = require("path");
const AppEvents = require(path.join(__dirname, "../events"));
const Db = require(path.join(__dirname, "/db"));
// Using enc cars
const { db_index_cities, db_index_climate } = process.env;

class Service {
  constructor() {
    this.db = Db;
    this.upload = this.upload.bind(this);
  }
  async upload(req, res) {
    let db_index = db_index_cities;
    let data = req.body.cities;

    if (req.body.climate) {
      db_index = db_index_climate;
      data = req.body.climate;
    }
    //Prepare data for bulk load
    data  = data.flatMap(doc => [{ index: { _index:  db_index} }, doc]);
    try {
      await this.db.bulk({
        index: `${db_index}`,
        refresh: "true",
        body: data,
      });
      return AppEvents.emit("success", req, res, {});
    } catch (error) {
      if (error.meta && error.meta.body) {
        error = error.meta.body;
      }
      return AppEvents.emit("error", req, res, {
        log: error,
        details: error,
        code: "202",
      });
    }
  }
}
module.exports = new Service();
