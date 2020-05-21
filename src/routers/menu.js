const express = require('express')
const Menu = require('../models/menu')
const auth = require('../middlewares/auth')
const restAuth = require('../middlewares/restAuth')
//const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/menu',restAuth, async (req, res) => {
    const menu = new Menu(req.body)
    try {
        await menu.save()
        res.status(201).send({menu})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/menu/restaurant/:id', auth, async (req, res) => {
    const restId = req.params.id
    try {
        const menus = await Menu.find({restaurant:restId})

        if (!menus) {
            return res.status(404).send()
        }
        menus.forEach(async(menu)=>{
            await menu.populate('menuitems').execPopulate()
        })
        res.send(menus)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/menu/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const menu = await Menu.findOne({ _id})

        if (!menu) {
            return res.status(404).send()
        }
        await menu.populate('menuitems').execPopulate()

        res.send(menu)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/menu/:id', restAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'restaurant']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const menu = await Menu.findOne({ _id: req.params.id})

        if (!menu) {
            return res.status(404).send()
        }

        updates.forEach((update) => menu[update] = req.body[update])
        await menu.save()
        res.send(menu)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/menu/:id', restAuth, async (req, res) => {
    try {
        const menu = await Menu.findOneAndDelete({ _id: req.params.id})

        if (!menu) {
            res.status(404).send()
        }
        res.send(menu)
    } catch (e) {
        res.status(500).send(e)
    }
})
module.exports = router