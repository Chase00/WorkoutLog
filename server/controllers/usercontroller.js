var router = require('express').Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

// Sign up
router.post('/signup', (req, res) => {
    var username = req.body.user.username;
    var pass = req.body.user.password;

    User
    .create({
        username: username,
        passwordhash: bcrypt.hashSync(pass, 10),
    })
    .then(
        function success(user) {
            var token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
            res.json({
                user: user,
                message: 'user created',
                sessionToken: token,
            })
        },
        function error(err){
            res.send(500, err.message);
        }
    );
});

// Sign in
router.post('/login', (req, res) => {
    // Database Query / Lookup
    User.findOne({ where: { username: req.body.user.username } }).then(
        function(user) {
            if (user) {
                bcrypt.compare(req.body.user.password, user.passwordhash, function (err, matches) {
                    if (matches) {
                        var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24});

                        res.json({
                            user: user,
                            message: "Logged In",
                            sessionToken: token,
                        })
                    } else {
                        res.status(502).send({message: "Invalid Password" });
                    }
                });
            } else {
                // Invalid login - tyop - no user found
                res.status(500).send({message: "Invalid Login" });
            }
        }
    )
});

module.exports = router;