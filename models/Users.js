const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    permission: {
        type: String,
        required: false,
        default: 'root'
    }
})

const User = mongoose.model('Users' , UserSchema);

module.exports = User