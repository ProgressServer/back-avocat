const mongoose = require('mongoose');

mongoose.connect(process.env.DB_LINK, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));