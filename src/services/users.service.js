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

const getAll = async () => {
    try {
        const users = await User.find()

        return users
    } catch (error) {
        throw error
    }
}

const updateOne = async (uid, newRole, newupdatedAt) => {
    try {
        if(newRole === 'user') {
            
            const userUpdate = await User.updateOne({_id: uid}, {role: 'user'}, newupdatedAt)
            
            return userUpdate
        } else if(newRole === 'premium') {
            const userUpdate = await User.updateOne({_id: uid}, {role: 'premium'}, newupdatedAt)
            
            return userUpdate
        } else if(newRole === 'admin') {
            const userUpdate = await User.updateOne({_id: uid}, {role: 'admin'}, newupdatedAt)
            
            return userUpdate
        }
    } catch (error) {
        throw error
    }
}

const updateOneAndStatus = async (uid, newStatus, newupdatedAt) => {
    try {
        const userDelete = await User.updateOne({_id: uid}, newStatus, newupdatedAt)

        return userDelete
    } catch (error) {
        throw error
    }
}

const findOne = async (uemail) => {
    try {
        const user = await User.findOne({ email: uemail })

        return user

    } catch (error) {
        throw error
    }
}

module.exports = {
    create,
    getAll,
    updateOne,
    updateOneAndStatus,
    findOne,
}
