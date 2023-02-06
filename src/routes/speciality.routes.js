const router = require('express').Router();
const specialityDb = require('../db/speciality.db');
const Speciality = require('../models/speciality')

//generate speciality
router.get('/generate', async (req, res) => {
    try {
        console.log('generate speciality')
        const result = await Speciality.insertMany(specialityDb)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//get one speciality
router.get('/:id', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await Speciality.findOne(filter)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//get all specialities
router.get('/', async (req, res) => {
    try {
        console.log('get all Speciality', req.query)
        const filter = {}
        if (req.query.id) filter._id = req.query.id
        const result = await Speciality.find(filter, null, { sort: { name: 1 } })
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//save speciality
router.post('/', async (req, res) => {
    try {
        console.log('save speciality', req.body)
        let speciality = new Speciality(req.body)
        speciality = await speciality.save()
        console.log('new', speciality)
        res.json(speciality)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//update speciality
router.put('/', async (req, res) => {
    try {
        const data = req.body
        const filter = {}
        if (data._id) filter._id = data._id
        else {
            res.status(404).json({ success: false, msg: "ID required" })
            return
        }
        const speciality = await Speciality.findOneAndUpdate(filter, data)
        res.json(speciality)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;