require('dotenv').config()

module.exports = {
    email: {
        identifier: process.env.EMAIL_IDENTIFIER,
        password: process.env.EMAIL_PASSWORD,
    }
}