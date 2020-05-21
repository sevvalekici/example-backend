const express = require('express')
const Order = require('../models/order')
const auth = require('../middlewares/auth')
const restAuth = require('../middlewares/restAuth')
//const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

router.post('/order',auth, async (req, res) => {
    const order = new Order(req.body)
    try {
        await order.save()
        res.status(201).send({order})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/order/all', auth, async (req, res) => {
    try {
        const orders = await Order.find({orderOwner:req.user._id})

        if (!orders) {
            return res.status(404).send()
        }
        orders.forEach(async(order)=>{
            await order.populate('itemslist').execPopulate()
        })
        res.send(orders)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/order/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const order = await Order.findOne({ _id})

        if (!order) {
            return res.status(404).send()
        }
        await order.populate('itemslist').execPopulate()

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/menuitem/status/:id', restAuth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['status']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const order = await Order.findOne({ _id: req.params.id})
        if (!order) {
            return res.status(404).send()
        }

        updates.forEach((update) => {
            if( req.body[update]=== 'delivery'|| req.body[update]=== 'completed')
            order[update] = req.body[update]
        })
        await order.save()
        res.send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})
module.exports = router