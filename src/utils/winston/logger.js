const winston = require('winston')

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({ level: 'debug'}),
        new winston.transports.Console({ level: 'info'}),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
})

const addLogger = (res, req, next) => {
    req.logger = logger
}