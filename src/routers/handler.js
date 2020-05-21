const express = require('express')
const router = express.Router()

router.get('/',(req, res) => {
    try { 

    return res.send().status(200)
     
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('*', async(req, res) => {
    res.status(404).send(e)
})

module.exports = router