const bcrypt = require('bcrypt') //to use bcrypt module for hashing password
const jwt = require('jsonwebtoken') //to use jwt module for unique token
const User = require('../model/user')

exports.signup = (req, res, next) => {
    bcrypt
        .hash(req.body.password, 10) //put many turn can take many time
        .then((hash) => {
            const user = new User({
                email: req.body.email,
                password: hash,
            })
            user.save()
                .then(() =>
                    res.status(201)
                )
                .catch(() => res.status(400))
        })
        .catch((error) => res.status(500).json({ error }))
}
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //verify if user exist
        .then((user) => {
            if (!user) {
                //if dosen't exist send error msg
                return res.status(400)
            }
            bcrypt
                .compare(req.body.password, user.password) //verify the validity between input user password and database. return bolean value
                .then((valid) => {
                    if (!valid) {
                        //if the value is false send error msg
                        return res.status(402)
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            //token creation with jwt
                            { userId: user._id },
                            'Random_token',
                            { expiresIn: '24h' } //expiration duration
                        ),
                    })
                })
                .catch((error) => res.status(500).json({ error }))
        })
        .catch((error) => res.status(500).json({ error }))
}
