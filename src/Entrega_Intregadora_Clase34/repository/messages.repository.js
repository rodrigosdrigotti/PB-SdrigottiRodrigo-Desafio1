class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    async sendMessage(messageInfo) {
        await this.dao.sendMessage(messageInfo)
    }
}

module.exports = MessageRepository