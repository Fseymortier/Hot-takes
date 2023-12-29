const jwt = require('jsonwebtoken') //to use jwt module for unique token

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, 'Random_token')
        const userId = decodedToken.userId
        req.auth = { userId: userId }
        if (req.body.userId && req.body.userId !== userId) {
            //if userId exist and
            throw 'User Id non valable'
        } else {
            next()
        }
    } catch (error) {
        res.status(400).json({ error: error | 'Requete non authentifiée' })
    }
}
