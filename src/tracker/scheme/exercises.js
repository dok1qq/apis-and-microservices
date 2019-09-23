const mongoose = require('mongoose');
const Users = require('./users');
const Schema = mongoose.Schema;

const Exercises = new Schema({
    description: {
        type: String,
        required: true,
        maxlength: [20, 'description too long']
    },
    duration: {
        type: Number,
        required: true,
        min: [1, 'duration too short']
    },
    date: {
        type: Date,
        default: Date.now
    },
    username: String,
    userId: {
        type: String,
        ref: 'Users',
        index: true
    }
});

// link user id to exercise
Exercises.pre('save', function(next) {
    Users.findById(this.userId, (err, user) => {
        if(err) return next(err);
        if(!user) {
            const err = new Error('unknown userId');
            err.status = 400;
            return next(err);
        }
        this.username = user.username;
        if(!this.date) {
            this.date = Date.now()
        }
        next();
    })
});

module.exports = mongoose.model('Exercises', Exercises);
