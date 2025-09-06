const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',      // Your DB host
  user: 'root',           // Your DB username
  password: '',           // Your DB password
  database: 'ecofinds',   // Your DB name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
