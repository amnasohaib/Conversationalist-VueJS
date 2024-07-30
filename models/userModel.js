const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema =  new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})


module.exports = model('user', UserSchema)
