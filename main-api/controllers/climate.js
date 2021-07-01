"use strict";

const path = require("path");
const AppEvents = require(path.join(__dirname, "../events"));
const Db = require(path.join(__dirname, "/db"));
const Joi = require("@hapi/joi");
const moment = require("moment");
const { db_index_cities, db_index_climate } = process.env;

class Service {
  constructor() {
    this.db = Db;
    this.climateByDate = this.climateByDate.bind(this);
  }
  async climateByDate(req, res) {
    const data = { ...req.params };

    // Input validation
    const climateSchema = Joi.object().options({ abortEarly: false }).keys({
      date: Joi.date().iso().required(),
    });

    let { error } = climateSchema.validate(data);

    if (error) {
      return AppEvents.emit("validationError", req, res, {
        log: error,
        details: error,
        code: "901",
      });
    }

    // Query definition can be in separate module
    // Finding available date range
    const datesBoundaryQuery = {
      index: db_index_climate,
      body: {
        aggs: {
          min_date: { min: { field: "LOCAL_DATE" } },
          max_date: { max: { field: "LOCAL_DATE" } },
        },
      },
    };

    try {
      // Min Max dates can be cashed / dates validation encapsulated in a function
      const datesResult = await this.db.search(datesBoundaryQuery);
      const maxDate = moment(datesResult.body.aggregations.max_date.value);
      const minDate = moment(datesResult.body.aggregations.min_date.value);

      if (
        moment(data.date).isAfter(maxDate.toISOString()) ||
        moment(data.date).isBefore(minDate.toISOString())
      ) {
        return AppEvents.emit("error", req, res, { log: error, code: "205" });
      }
    } catch (error) {
      if (error.meta && error.meta.body) {
        error = error.meta.body;
      }
      return AppEvents.emit("error", req, res, { log: error, code: "204" });
    }
    // Assumption: urban city aria if population > population_proper
    const urbanAriaQuery = {
      index: db_index_cities,
      body: {
        _source: ["city", "lat", "lng"],
        query: {
          bool: {
            must: [
              {
                match: {
                  // Skip non Canadian if any
                  country: "Canada",
                },
              },
            ],
            filter: {
              script: {
                script:
                  "doc['population'].value > doc['population_proper'].value",
              },
            },
          },
        },
      },
    };
    try {
      const urbanCitiesGeoData = await this.db.search(urbanAriaQuery);
      // Calculate average temperature on selected date for urban Canadian cities

      // ! Need add geo filter to query
      // =====================================================================================
      // Idea is to find all results for a date provided by user input and geo locations that 
      // Collected from urbanAriaQuery
      // something like:
      //  "geo_distance": {
      //    "distance": "12km",
      //    "pin.location": [ -70, 40 ]
      //  }
      // The thing that geo points in urbanAriaQuery is an array 
      // Will need to educate my self on best approach 

      const temperatureQuery = {
        index: db_index_climate,
        body: {
          query: {
            bool: {
              must: [
                { match: { LOCAL_DATE: `${moment(data.date).toISOString()}` } }
              ],
            },
          },
          aggs: {
            mean: { avg: { field: "MEAN_TEMPERATURE" } },
            median: { median_absolute_deviation: { field: "MEAN_TEMPERATURE" }}
        }
      }
    };
      const result = await this.db.search(temperatureQuery);
      return AppEvents.emit('success', req, res, result.body.aggregations);
    } catch (error) {
      if (error.meta && error.meta.body) {
        error = error.meta.body;
      }
      return AppEvents.emit("error", req, res, { log: error, code: "204" });
    }
  }
}
module.exports = new Service();
