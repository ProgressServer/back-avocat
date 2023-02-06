require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK || 'mongodb://127.0.0.1:27017/avocat_depoch', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));