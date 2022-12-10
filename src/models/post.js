const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    description: { type: String, },
    image: { type: String, },
}, { timestamps: true });

schema.plugin(mongoosePaginate);

module.exports = Post = mongoose.model('Post', schema)