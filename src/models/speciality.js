const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, required: true, },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
}, { timestamps: true });

module.exports = Speciality = mongoose.model('Speciality', schema)