require('dotenv').config({path: __dirname + '/.env'}); console.log('USER: [' + process.env.SMTP_USER + ']'); console.log('PASS: [' + process.env.SMTP_PASS + ']');
