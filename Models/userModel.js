const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    userName:{
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

const userData = mongoose.model('userData', userSchema)
module.exports = userData