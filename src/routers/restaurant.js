const express = require('express')
const Restaurant = require('../models/restaurant')
const restAuth = require('../middlewares/restAuth')
const auth = require('../middlewares/auth')
const router = new express.Router()
const multer = require('multer')

router.post('/restaurants', restAuth, async (req, res) => {
    const restaurant = new Restaurant({
        ...req.body,
        owner: req.user._id
    })
    try {
        await restaurant.save()
        res.status(201).send(restaurant)
    } catch (e) {
        res.status(400).send(e)
        console.log(e)
    }
})

router.get('/restaurants', auth, async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})
        res.send(restaurants)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/restaurants/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const restaurant = await Restaurant.findOne({ _id })

        if (!restaurant) {
            return res.status(404).send()
        }

        res.send(restaurant)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/restaurants/openorders/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const restaurant = await Restaurant.findOne({ _id })
        if (!restaurant) {
            return res.status(404).send()
        }
        await restaurant.populate('orders').execPopulate()

        res.send(restaurant.orders)
    } catch (e) {
        res.status(500).send()
    }
})
router.patch('/restaurants/:id', restAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.id})

        if (!restaurant) {
            return res.status(404).send()
        }

        updates.forEach((update) => restaurant[update] = req.body[update])
        await restaurant.save()
        res.send(restaurant)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/restaurants/:id', restAuth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOneAndDelete({ _id: req.params.id })

        if (!restaurant) {
            res.status(404).send()
        }

        res.send(restaurant)
    } catch (e) {
        res.status(500).send()
    }
})
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

router.post('/restaurants/pic/:id', auth, upload.single('pic'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const restaurant = await Restaurant.findOne({ _id: req.params.id})

        if (!restaurant) {
            return res.status(404).send()
        }
    restaurant.pic = buffer
    await restaurant.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/restaurants/pic/:id', auth, async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.id})

        if (!restaurant) {
            return res.status(404).send()
        }
        restaurant.pic = undefined
        await restaurant.save()
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/restaurants/pic/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ _id: req.params.id})

        if (!restaurant || !restaurant.pic) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(restaurant.pic)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router