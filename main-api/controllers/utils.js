'use strict'
// Helper to extract configuration in this implementation from JSON file
const path = require('path');
const config = require(path.join(__dirname, '../config/index.json'));

class Service {
    constructor() {
        this.data = config;
    }
    getConfig(key) {
        // key = top.sub.sub
        key = key.split('.');
        let data = this.data;
        for (let k of key) {
            data = data[k];
        }
        return { ...data };
    }
    getValue(store, key) {
        let result = store[key];
        if (!result) {
            for (let field in store) {
                if (store[field] == key) {
                    result = field;
                    break;  
                }
            }
        }
        result = result || key;
        return result;
    }
}
module.exports = new Service();