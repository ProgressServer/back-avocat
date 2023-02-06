const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, },
    content: { type: String, },
    more: { type: String, },
    children: [{
        title: { type: String, },
        content: { type: String, },
        more: { type: String, },
        children: [{
            title: { type: String, },
            content: { type: String, },
            more: { type: String, },
        }],
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }
}, { timestamps: true });

module.exports = Droit = mongoose.model('Droit', schema)