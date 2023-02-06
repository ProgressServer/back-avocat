const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        index: true,
    }],
}, { timestamps: true });

module.exports = Droit = mongoose.model('Discussion', schema)