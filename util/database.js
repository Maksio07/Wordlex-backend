const mysql = require('mysql2');
const {DBHost, DBPass, DBUser} = require('../config/index')

const pool = mysql.createPool({
    host: DBHost,
    user: DBUser,
    database: 'wordlex',
    password: DBPass
})

module.exports = pool.promise();