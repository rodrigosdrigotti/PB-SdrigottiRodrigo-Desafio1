const { faker } = require('@faker-js/faker')

const generateProducts = numProds => {
    const products = []

    for(let i = 0; i < numProds ; i++) {
        products.push(generateProduct())
    }
        
    return products
}

const generateProduct = () => {
    return {
        id_: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        stock: faker.string.numeric({length: 2, exclude: ['0']}),
        category: faker.commerce.department(),
        thumbnail: faker.image.urlLoremFlickr({category: 'fashion'}),
    }
}

module.exports = generateProducts