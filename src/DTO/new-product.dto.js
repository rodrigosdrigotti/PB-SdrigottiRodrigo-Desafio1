//const { v4: uuidv4 } = require('uuid')

class NewProductDto {
    constructor(productInfo) {
        //this.id = uuidv4()

        /* if(!this.title || !this.description || !this.code || !this.price || !this.stock || !this.category)
            res
            .status(HTTP_RESPONSES.BAD_REQUEST)
            .json({ status: 'error', error: HTTP_RESPONSES.BAD_REQUEST_CONTENT}) */
            
        if(productInfo.updatedAt) {
            this.title = productInfo.title,
            this.description = productInfo.description,
            this.code = productInfo.code,
            this.price = productInfo.price,
            this.stock = productInfo.stock,
            this.category = productInfo.category
            this.thumbnail = productInfo.thumbnail
            this.updatedAt = productInfo.updatedAt
        }
        else {
            this.title = productInfo.title,
            this.description = productInfo.description,
            this.code = productInfo.code,
            this.price = productInfo.price,
            this.stock = productInfo.stock,
            this.category = productInfo.category
            this.thumbnail = productInfo.thumbnail
        }
    }
}

module.exports = NewProductDto