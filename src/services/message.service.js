const Message = require('../models/message')

async function saveMessage(message) {
    const newMessage = new Message(message)
    const saved = await newMessage.save()
    return saved
}

module.exports = {
    saveMessage
}