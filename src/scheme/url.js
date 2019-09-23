const mongoose = require('mongoose');

const urlScheme = mongoose.Schema({
    short: String,
    full: String,
});

const Url = mongoose.model('Url', urlScheme);

module.exports = Url;
