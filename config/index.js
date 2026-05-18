const dotenv = require('dotenv')
dotenv.config()

const { DBPass, DBHost, DBUser, PORT, SECRET_ACCESS_TOKEN, SECRET_SENDGRID_KEY, DBName } = process.env;

module.exports =  { DBPass, DBHost, DBUser, PORT, SECRET_ACCESS_TOKEN, SECRET_SENDGRID_KEY, DBName };
