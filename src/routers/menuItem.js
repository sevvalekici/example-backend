const express = require('express')
const MenuItem = require('../models/menuItem')
const restAuth = require('../middlewares/restAuth')
const auth = require('../middlewares/auth')
const multer = require('multer')

const router = new express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/menuitem',restAuth, upload.single('pic'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const menuItem = new MenuItem(req.body,
                                
                                )
    try {
        await menuItem.save()
        res.status(201).send({ menuItem})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get('/menuitem/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const menuitem = await MenuItem.findOne({ _id})

        if (!menuitem) {
            return res.status(404).send()
        }
        res.send(menuitem)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/menuitem/:id', restAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'name','cost','itemType','pic','removelist','additionlist']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const menuitem = await MenuItem.findOne({ _id: req.params.id})

        if (!menuitem) {
            return res.status(404).send()
        }

        updates.forEach((update) => menuitem[update] = req.body[update])
        await menuitem.save()
        res.send(menuitem)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/menuitem/:id', restAuth, async (req, res) => {
    try {
        const menuitem = await MenuItem.findOneAndDelete({ _id: req.params.id})

        if (!menuitem) {
            res.status(404).send()
        }

        res.send(menuitem)
    } catch (e) {
        res.status(500).send(e)
    }
})



router.post('/menuitem/pic/:id', auth, upload.single('pic'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const menuitem = await MenuItem.findOne({ _id: req.params.id})

        if (!menuitem) {
            return res.status(404).send()
        }
    menuitem.pic = buffer
    await menuitem.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/menuitem/pic/:id', auth, async (req, res) => {
    try {
        const menuitem = await MenuItem.findOne({ _id: req.params.id})

        if (!menuitem) {
            return res.status(404).send()
        }
        menuitem.pic = undefined
        await menuitem.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/menuitem/pic/:id', async (req, res) => {
    try {
        const menuitem = await MenuItem.findOne({ _id: req.params.id})

        if (!menuitem || !menuitem.pic) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(menuitem.pic)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router