const mongoose = require('mongoose')
const { urlMongo } = require('../configs/urlMongo')

/* const mongoConnect = async () => {
    try {
       await mongoose.connect(urlMongo)
       console.log('DB is connected')
    } catch (error) {
        console.log(error)
    }
} */

class MongoConnect {
    static #instance
  
    constructor() {
      this.mongoConnect()
    }
  
    async mongoConnect() {
        try {
            await mongoose.connect(urlMongo)
            
         } catch (error) {
             console.log(error)
         }
    }
  
    static getInstance() {
      if (!this.#instance) {
        this.#instance = new MongoConnect()
        console.log('DB is connected')
  
        return this.#instance
      }
  
      console.log('DB is already connected')
      return this.#instance
    }
  }

module.exports = MongoConnect