const Users = require('../scheme/users');

module.exports = (req, res) => {
    Users.find({}, (err, data) => {
        res.json(err ? err : data);
    });
};
