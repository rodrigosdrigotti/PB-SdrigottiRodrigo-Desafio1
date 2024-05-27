class MessageRepository {
    constructor(dao) {
        this.dao = dao
    }

    async sendMessage(messageInfo, code) {
        await this.dao.sendMessage(messageInfo, code)
    }
}

module.exports = MessageRepository