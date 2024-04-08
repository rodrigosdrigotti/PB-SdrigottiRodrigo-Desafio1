class NewProductDto {
    constructor(productInfo) {
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