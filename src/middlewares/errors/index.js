const ErrorCodes = require('../../handlers/errors/enum-errors')

const errorMiddleware = (error, req, res, next) => {
  console.log(error.cause)
  switch (error.code) {
    case ErrorCodes.INVALID_PRODUCT_INFO:
      res
        .status(ErrorCodes.INVALID_PRODUCT_INFO)
        .json({ status: 'error', error: error.name })
      break

    default:
      res
        .status(ErrorCodes.INTERNAL_SERVER_ERROR)
        .json({ status: 'error', error: 'Internal Server Error' })
      break
  }
}

module.exports = errorMiddleware