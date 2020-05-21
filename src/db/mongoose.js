const mongoose = require('mongoose')
const config = require('../../config')

mongoose.connect(config.database.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
})