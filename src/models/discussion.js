const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }],
    messages: [{
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        content: { type: String },
        date: { type: Date },
    }]
}, { timestamps: true });

module.exports = Droit = mongoose.model('Discussion', schema)