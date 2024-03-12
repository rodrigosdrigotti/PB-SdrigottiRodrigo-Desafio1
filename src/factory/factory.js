const { environment } = require('../configs/server.config')

switch (environment) {
  case 'dev':
    console.log('Usando Nodemailer')
    module.exports = require('../DAO/services/mail.dao')
    break

  case 'prod':
    console.log('Usando Twilio')
    
    break

  default:
    break
}