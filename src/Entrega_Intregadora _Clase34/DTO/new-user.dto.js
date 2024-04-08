//const { v4: uuidv4 } = require('uuid')
const { createHash } = require('../utils/crypt-password.util')

class NewUserDto {
    constructor(userInfo) {
        //this.id = uuidv4()
        this.first_name = userInfo.first_name
        this.last_name = userInfo.last_name 
        this.email = userInfo.email
        this.password = createHash(userInfo.password)
    }
}

module.exports = NewUserDto