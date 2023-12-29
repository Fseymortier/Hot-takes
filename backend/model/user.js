const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const user = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //unique: true to create account with unique email
    password: { type: String, required: true },
})

user.plugin(uniqueValidator) //to use the plugin mongoose

module.exports = mongoose.model('User', user)
