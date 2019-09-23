const Users = require('../scheme/users');
const Exercises = require('../scheme/exercises');

module.exports = (req, res) => {
    const {
        userId,
        limit,
        to: end,
        from: start,
    } = req.query;

    const $gt = start ? new Date(start).getTime() : 0;
    const $lt = end ? new Date(end).getTime() : new Date().getTime();

    Users.findById(userId, (err, user) => {
        if(err) { return res.json(err); }
        if(!user) { return res.send('unknown userId'); }

        const params = { userId, date: { $gt, $lt } };

        Exercises
            .find(params, { __v: 0, _id: 0})
            .sort('-date')
            .limit(parseInt(limit))
            .exec((err, exercises) => {
                if(err) { return res.json(err); }

                const log = exercises.map(exercise => ({
                        description : exercise.description,
                        duration : exercise.duration,
                        date: exercise.date.toDateString()
                    })
                );

                const result = {
                    _id: userId,
                    log,
                    username: user.username,
                    from : start ? new Date(start).toDateString() : undefined,
                    to : end ? new Date(end).toDateString(): undefined,
                    count: exercises.length,
                };

                res.json(result);
            });
    })
};
