const { environment } = require('../../configs/server.config')

switch (environment) {
  case 'dev':
    module.exports = require('./devLogger')
    break

  case 'prod':
    module.exports = require('./prodLogger')
    break
}