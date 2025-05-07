const path = require("path");
const pg = require("pg");
const { dbLocal } = require(path.join(__dirname, "./index.js"));

const db = new pg.Client({
    user: dbLocal.user,
    password: dbLocal.password,
    host: dbLocal.host,
    port: dbLocal.port,
    database: dbLocal.database,
});

db.connect();

module.exports = db;