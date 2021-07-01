// Connecting to DB and expose DB client object to services
const { db_user, db_password, db_host } = process.env;
const { Client } = require('@elastic/elasticsearch')
const esClient = new Client({ node: `http://${db_user}:${db_password}@${db_host}` })

module.exports = esClient;