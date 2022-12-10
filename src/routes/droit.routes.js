const router = require('express').Router();
const droitDb = require('../db/droit.db');
const Droit = require('../models/droit')

router.get('/generate', async (req, res) => {
    try {
        console.log('generate droit')
        const result = await Droit.insertMany(droitDb)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await Droit.findOne(filter)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.get('/', async (req, res) => {
    try {
        console.log('get Droit')
        const filter = {}
        if (req.query.id) filter._id = req.query.id
        const result = await Droit.find(filter, null, { sort: { updatedAt: 1 } })
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.post('/', async (req, res) => {
    try {
        console.log('save droit', req.body)
        let droit = new Droit(req.body)
        droit = await droit.save()
        console.log('new', droit)
        res.json(droit)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.put('/', async (req, res) => {
    try {
        const data = req.body
        const filter = {}
        if (data._id) filter._id = data._id
        else {
            res.status(404).json({ success: false, msg: "ID required" })
            return
        }
        const droit = await Droit.findOneAndUpdate(filter, data)
        res.json(droit)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;