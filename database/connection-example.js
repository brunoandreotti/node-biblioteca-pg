const { Pool } = require('pg')

const pool = new Pool({
  user: 'USER',
  host: 'HOSTNAME',
  database: 'DBMANE',
  password: 'PASSWORD',
  port: PORT,
  max: 10
})

module.exports = pool