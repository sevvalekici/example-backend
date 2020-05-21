require('dotenv').config({path: __dirname + '/.env'});

const config = {
     server: {
       //hostname: process.env.SERVER_HOSTNAME,
       port: process.env.PORT,
     },
    jwttoken: {
      secret: process.env.JWT_SECRET
    },
    database: {
      url: process.env.MONGODB_URL,
    }
  }

  module.exports = config;