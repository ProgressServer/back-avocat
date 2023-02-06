const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    content: { type: String },
    date: { type: Date },
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Discussion',
        index: true,
    },
    // unread: [{ type: String, default: [] }]
    unread: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = Message = mongoose.model('Message', schema)