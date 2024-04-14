const swaggerJSDoc = require('swagger-jsdoc')

const swaggerOptions = {
    definition: {
      openapi: '3.0.3',
      info: {
        title: "Documentación De API",
        description: "Es la documentación de un ecommerce de Indumentaria Deportiva", 
      }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
  }

const specs = swaggerJSDoc(swaggerOptions)

module.exports = specs