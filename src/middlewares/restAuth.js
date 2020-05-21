const jwt = require('jsonwebtoken')
const User = require('../models/user')
const config = require('../../config')

const restAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, config.jwttoken.secret)
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        if (!user|| (user.role) !== 'restOwner') {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate as restaurant owner.' })
        console.log(e)
    }
}

module.exports = restAuth