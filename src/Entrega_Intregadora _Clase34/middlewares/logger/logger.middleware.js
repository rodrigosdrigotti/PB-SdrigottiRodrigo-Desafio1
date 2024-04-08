const winstonLogger = require('../../utils/winston/factory')

const logger = (req, res, next) => {
    req.logger = winstonLogger

    next()
}

module.exports = logger