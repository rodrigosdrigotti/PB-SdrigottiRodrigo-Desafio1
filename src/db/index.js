const mongoose = require('mongoose')
const { urlMongo } = require('../configs/urlMongo')

const mongoConnect = async () => {
    try {
       await mongoose.connect(urlMongo)
       console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
}

module.exports = mongoConnect