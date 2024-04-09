const User = require("../DAO/models/user.model");
const messageManager = require("../repository");

const create = async newUserInfo => {
    try {
        const user = await User.create(newUserInfo)
        
        await messageManager.sendMessage(newUserInfo)

        return user
    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
}
