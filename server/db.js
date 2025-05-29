const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER, // example: your-db-server.database.windows.net
  database: process.env.DB_NAME,
  options: {
    encrypt: true, // for Azure
    enableArithAbort: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to Azure SQL Database');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed:', err));

module.exports = {
  sql, poolPromise
};
