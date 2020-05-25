const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const { sendConfirmationEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendConfirmationEmail(user.email, user.name, user.surname)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','surname', 'email', 'password','role','isActivated','address']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.post('/users/adress', auth, async (req, res) => {
    try {
        const address = req.body
        if(!address){
            res.status(406).send()  
        }
        req.user['addresses'].push(address)
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch('/users/address/:id', auth, async (req, res) => {
    try {
        const newaddress = req.body
        if(!newaddress){
            res.status(406).send()  
        }
        req.user.addresses.forEach(addrs => {
            if(addrs._id === req.params.id){
                addrs = newaddress
            }
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/adress/:id', auth, async (req, res) => {
    try {
        const newaddress = req.body
        if(!newaddress){
            res.status(406).send()  
        }
        req.user.addresses.forEach(addrs => {
            if(addrs._id === req.params.id){
                const index = array.indexOf(addrs)
            }
        })
        if (index > -1) {
            req.user.address.splice(index, 1)
        }
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router