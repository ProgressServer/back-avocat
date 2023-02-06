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
        console.log("Find By Id");
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
        console.log('get All Droit')
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
        res.json(droit)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.put('/', async (req, res) => {
    try {
        const data = req.body
        console.log("Update droit: ", data);
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

router.delete('/:id', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await Droit.deleteOne(filter)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.get('/childrens/:id', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await Droit.findOne(filter)
        res.json(result["children"])
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})


router.delete('/childrens/:id/:idChildren', async (req, res) => {
    try {
        var droit_id = req.params.id;
        var children_id = req.params.idChildren;
        console.log("Delete children: ", droit_id + " - " + children_id);
        Droit.findByIdAndUpdate(
            droit_id,
            { $pull: { 'children': { _id: children_id } } }, function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                console.log(model);
                return res.json(model);
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.put('/childrens/:id/:idChildren', async (req, res) => {
    try {
        var droit_id = req.params.id;
        var children_id = req.params.idChildren;
        var data = req.body;
        var sous_children_id = data._id;
        console.log(droit_id);
        console.log(children_id);
        console.log(data);
        Droit.updateOne(
            {
                "droit._id": droit_id,
                "children": {
                    "$elemMatch": {
                        "children_id": children_id, "children._id": sous_children_id
                    }
                }
            },
            {
                "$set": {
                    "children.$[outer].children.$[inner].title": data.title,
                    "children.$[outer].children.$[inner].content": data.content,
                    "children.$[outer].children.$[inner].more": data.more,
                }
            },
            {
                "arrayFilters": [
                    { "outer._id": children_id },
                    { "inner._id": sous_children_id }
                ]
            }, (err, result) => {
                if (err) {
                    console.log('Error updating service: ' + err);
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log(result)
                    return res.json(result);
                }
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})


router.delete('/childrens/:id/:idChildren/:idSousCategorie', async (req, res) => {
    try {
        var droit_id = req.params.id;
        var children_id = req.params.idChildren;
        var sous_children_id = req.params.idSousCategorie;
        console.log("delete sous categorie");
        console.log(droit_id);
        console.log(children_id);
        console.log(sous_children_id);
        Droit.updateOne(
            {
                "droit._id": droit_id,
                "children": {
                    "$elemMatch": {
                        "children_id": children_id, "children._id": sous_children_id
                    }
                }
            },
            { $pull: { "children.$[outer].children": { _id: sous_children_id } } },
            {
                "arrayFilters": [
                    { "outer._id": children_id },
                    { "inner._id": sous_children_id }
                ]
            }, (err, result) => {
                if (err) {
                    console.log('Error updating service: ' + err);
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    console.log(result)
                    return res.json(result);
                }
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.post('/childrens/:id/:idChildren', async (req, res) => {
    try {
        var droit_id = req.params.id;
        var children_id = req.params.idChildren;
        console.log("Insert sous categorie");
        console.log(droit_id);
        console.log(children_id);
        console.log(req.body);
        var add = "children." + children_id + ".children";
        Droit.findByIdAndUpdate(
            droit_id,
            { $push: { [add]: req.body } },

            { safe: true, upsert: true }, (err, model) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                return res.json(model);
            });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})


router.put('/childrens/:id', async (req, res) => {
    try {
        const data = req.body
        console.log("Update droit: ", data);
        Droit.update({ 'children._id': data._id },
            {
                '$set': {
                    'children.$.title': data.title,
                    'children.$.content': data.content,
                    'children.$.more': data.more,
                }
            },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                return res.json(model);
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.put('/childrens/:id/:idChildren', async (req, res) => {
    try {
        const data = req.body
        console.log("Update sous catégorie: ", data);
        Droit.updateOne({ 'children._id': data._id },
            {
                '$set': {
                    'children.$.children': data,
                }
            },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                return res.json(model);
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})


router.post('/childrens/:id', async (req, res) => {
    try {
        var droit_id = req.params.id;
        const data = req.body
        console.log("Add new children: ", data);
        Droit.findByIdAndUpdate(
            droit_id,
            { $push: { "children": req.body } },
            { safe: true, upsert: true },
            function (err, model) {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                return res.json(model);
            });

    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})



module.exports = router;