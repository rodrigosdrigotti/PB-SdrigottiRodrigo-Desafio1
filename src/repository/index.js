const MessageFactory = require('../factory/factory')
const MessageRepository = require("./messages.repository");

const messageManager = new MessageRepository(new MessageFactory())

module.exports = messageManager