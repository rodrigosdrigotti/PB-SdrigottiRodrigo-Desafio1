const { dbUser, dbPassword, dbHost, dbName } = require('./db.config')

module.exports =  {
    urlMongo: `mongodb+srv://${dbUser}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`,
}
