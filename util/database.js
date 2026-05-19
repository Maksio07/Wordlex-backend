const mysql = require('mysql2')
const { DBHost, DBPass, DBUser, DBName, DBPort } = require('../config/index')

const pool = mysql.createPool({
	host: DBHost,
	user: DBUser,
	database: DBName,
	password: DBPass,
	port: DBPort,
})

module.exports = pool.promise()
