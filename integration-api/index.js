'use strict'
const server = require('./server.js');
const host = process.env.host || 'localhost';
const port = process.env.port || 8080;

server.listen(port, () => {
    console.log(`Server started ${host} ${port}`);
});