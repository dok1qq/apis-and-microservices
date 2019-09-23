const Users = require('../scheme/users');
const Exercises = require('../scheme/exercises');

module.exports = (req, res) => {
    const { userId } = req.body;
    Users.findById(userId, (err, user) => {
        if (err) {
            return res.json(err);
        }

        if (!user) {
            return res.json('unknown _id');
        }

        const exercise = new Exercises(req.body);
        exercise.username = user.username
        exercise.save((err, data) => {
            if(err) if (err) {
                return res.json(err);
            }

            const {
                userId: _id,
                description,
                duration,
                username,
                date,
            } = data;

            res.json({
                _id,
                description,
                duration,
                username,
                date: (new Date(date)).toDateString()
            });
        })
    })
};
