const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
    firstname: { type: String, required: true, },
    lastname: { type: String, required: true, },
    username: { type: String },
    email: { type: String, required: true, },
    password: { type: String, required: true, },
    phone: { type: String, },
    barreau: { type: String, },
    speciality: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Speciality',
        index: true,
    }],
    gender: { type: String, },
    website: { type: String, },
    bio: { type: String, },
    activated: { type: Boolean, },
    activationLimit: { type: Date, },
    activationCode: { type: String, },
    roles: [String], //avocat, justiciable, admin
    follow: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    }],
    // followedBy: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     index: true,
    // }],
    profilePicture: { type: String },
}, { timestamps: true });

module.exports = User = mongoose.model('User', schema)