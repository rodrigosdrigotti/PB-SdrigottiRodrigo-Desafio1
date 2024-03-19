const generateProductErrorInfo = productInfo => {
    return `One or more properties were incomplete or note valid.
    List of required properties:
    * Title   : needs to be a string, received ${productInfo.title},
    * Description   : needs to be a string, received ${productInfo.description},
    * Code   : needs to be a string, received ${productInfo.code},
    * Price   : needs to be a number, received ${productInfo.price},
    * Stock   : needs to be a number, received ${productInfo.stock},
    * Category   : needs to be a string, received ${productInfo.category}`
}

module.exports = generateProductErrorInfo