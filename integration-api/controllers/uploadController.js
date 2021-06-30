"use strict";
// Bulk load cities and climate data
// Receive .xlsx file => convert to JSON => call main API to save data
const path = require("path");
const AppEvents = require(path.join(__dirname, "../events"));
const excelToJson = require("convert-excel-to-json");
const axios = require("axios");

class Service {
  constructor() {
    this.uploadCities = this.uploadCities.bind(this);
    this.uploadClimate = this.uploadClimate.bind(this);
    this.mainApi = process.env.baseURL.concat(process.env.mainApi);
  }

  async uploadCities(req, res) {
    const citiesDocument = excelToJson({
      source: req.files.filename.data,
    });
    try {
      //Call main api to load cities
      const cities = this.preparePayload(citiesDocument[Object.keys(citiesDocument)[0]]);
      await axios.post(
        `${this.mainApi}/upload/cities`,
        {cities: cities}
      );
      return AppEvents.emit("success", req, res, { status: "ok" });
    } catch (error) {
      console.log(error);
      return AppEvents.emit("error", req, res, error);
    }
  }

  async uploadClimate(req, res) {
    const climateDocument = excelToJson({
      source: req.files.filename.data,
    });
    try {
      //Call main api to load climate data
      const climate = this.preparePayload(climateDocument[Object.keys(climateDocument)[0]]);
      await axios({
        method: 'post',
        url: `${this.mainApi}/upload/climate`,
        data: {climate: climate},
        maxContentLength: 25 * 1024 * 1024, // 25mb
        maxBodyLength: 25 * 1024 * 1024
      });
      return AppEvents.emit("success", req, res, { status: "ok" });
    } catch (error) {
      console.log(Object.keys(error));
      return AppEvents.emit("error", req, res, error);
    }
  }

  preparePayload(dataArray) {
    // first entry in data array is columns names
    const result = [];
    const keys = dataArray[0];
    dataArray.shift();
    dataArray.forEach((entry) => {
      let singleResult = {};
      for (let key in entry) {
        singleResult[keys[key]] = entry[key];
      }
      result.push(singleResult);
    });
    return result;
  }
}
module.exports = new Service();
