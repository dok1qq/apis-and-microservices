const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const username = {
    type: String,
    required: true,
    unique: true,
    maxlength: [20, 'username too long']
};

const Users = new Schema({ username });

module.exports = mongoose.model('Users', Users);
