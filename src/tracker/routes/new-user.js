const Users = require('../scheme/users');

module.exports = (req, res) => {
    const user = new Users(req.body);
    user.save((err, data) => {
        if(err) {
            return res.send('username already taken');
        }

        const { _id, username } = data;
        res.json({ _id, username });
    })
};
