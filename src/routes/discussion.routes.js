const router = require('express').Router();
const Message = require('../models/message')
const multer = require('multer')
const uuid = require('uuid');
const Discussion = require('../models/discussion');

const maxSize = 3

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname
        const [extension, ...nameParts] = originalname.split('.').reverse()
        filename = uuid.v4() + Date.now() + '.' + extension
        if (!req.file) {
            req.file = {}
        }
        req.file = filename
        cb(null, filename)
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: maxSize * 1024 * 1024,
    },
}).single('image')

const handleUpload = (req, res, next) => {
    upload(req, res, err => {
        console.log('dsadasdasd', err)
        if (err) {
            console.log('err instanceof multer.MulterError', err instanceof multer.MulterError)
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    res.status(400).send(
                        'Vous ne pouvez ajouter que 3 pièces jointes maximum'
                    )
                } else if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).send(
                        `L'image envoyée ne doit pas excéder ${maxSize} Mo`
                    )
                }
            } else {
                res.status(500).send("Une erreur s'est produite")
            }
        } else {
            next()
        }
    })
}

// modify unread to true fo all
router.get('/unread', async (req, res) => {
    try {
        const filter = {}
        await Message.updateMany(filter, { $set: { unread: true } })
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// modify unread to true fo all
router.get('/unread-count', async (req, res) => {
    try {
        const { connectedUser } = req.query
        console.log('req.query', req.query)
        let options = { sort: { updatedAt: -1 } }
        let projections = { messages: { $slice: -1 } }
        const filter = {}
        if (connectedUser) {
            filter.members = connectedUser
        }
        else {
            return res.status(400).json({ msg: 'Connected user required' })
        }
        console.log('filter', filter)
        const result = await Discussion.find(filter, projections, options)
            .populate({
                path: 'messages',
            })
            .lean()
        let count = 0;
        for (const disc of result) {
            if (disc.messages[0] && disc.messages[0].sender != connectedUser && disc.messages[0].unread) count++
        }
        res.send({ count, nbDiscussion: result.length })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// modify unread to false for all messages of a discussion
router.put('/unread', async (req, res) => {
    try {
        console.log('updateUnread', req.body)
        const data = req.body
        const filter = {}
        if (data.discussionId) {
            filter.discussion = data.discussionId
            filter.unread = true
        }
        else {
            res.status(400).json({ msg: "Discussion ID required" })
            return
        }
        await Message.updateMany(filter, { $set: { unread: false } })
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//show image
router.get('/show', (req, res, next) => {
    try {
        const { fileName } = req.query
        const fs = require('fs')
        const path = require('path')
        console.log('document.download: started')
        const pathname = path.join(__dirname, '../../uploads/', fileName)
        const file = fs.createReadStream(pathname)
        res.setHeader('Content-Disposition', 'inline: filename="' + fileName + '"')
        file.pipe(res)
    } catch (error) {
        next(error)
    }
})

// get messages from discussion
router.get('/messages', async (req, res) => {
    try {
        const { search, orderBy, orderDir, userId, connectedUser } = req.query
        console.log('req.query bbbeee', req.query)
        let options = { sort: { updatedAt: -1 } }
        let projections = { messages: { $slice: -1 } }
        // let projections = null
        // let projections = { messages: {$slice: -1} }
        const filter = {}
        if (connectedUser) {
            filter.members = connectedUser
        }
        else {
            return res.status(400).json({ msg: 'Connected user required' })
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        if (userId) {
            filter.owner = userId
        }
        if (orderBy) {
            options = { sort: { [orderBy]: orderDir || -1 } }
        }
        // if (searchPj) {
        //     filter['attachments.oldName'] = { $regex: searchPj, $options: 'i' }
        // }
        console.log('filter', filter)
        // const result = await Discussion.find(filter, null, options)
        //     .populate({
        //         path: 'messages',
        //         select: '_id'
        //     })
        const result = await Discussion.find(filter, projections, options)
            .populate({ path: 'members', select: '-speciality', })
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: '-speciality',
                }
            })
            .lean()
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//get one
router.get('/:id', async (req, res) => {
    try {
        console.log('asdasd')
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await Message.findOne(filter)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// get last message
router.get('/', async (req, res) => {
    try {
        const { search, orderBy, orderDir, userId, connectedUser, projection, discussionId } = req.query
        console.log('req.query', req.query)
        let options = { sort: { updatedAt: -1 } }
        let projections = projection ? { messages: { $slice: -1 } } : null
        // let projections = { messages: {$slice: -1} }
        const filter = {}
        if (connectedUser) {
            filter.members = connectedUser
        }
        else {
            return res.status(400).json({ msg: 'Connected user required' })
        }
        if (discussionId) {
            filter._id = discussionId
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        if (userId) {
            filter.owner = userId
        }
        if (orderBy) {
            options = { sort: { [orderBy]: orderDir || -1 } }
        }
        // if (searchPj) {
        //     filter['attachments.oldName'] = { $regex: searchPj, $options: 'i' }
        // }
        console.log('filter', filter)
        // const result = await Discussion.find(filter, null, options)
        //     .populate({
        //         path: 'messages',
        //         select: '_id'
        //     })
        const result = await Discussion.find(filter, projections, options)
            .populate({
                path: 'members',
                select: '-speciality'
            })
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: '-speciality'
                }
            })
            .lean()
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// get all + search
router.get('/', async (req, res) => {
    try {
        const { search, orderBy, orderDir, userId, } = req.query
        console.log('req.query', req.query)
        let options = { sort: { date: -1 } }
        const filter = {}
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        if (userId) {
            filter.owner = userId
        }
        if (orderBy) {
            options = { sort: { [orderBy]: orderDir || -1 } }
        }
        // if (searchPj) {
        //     filter['attachments.oldName'] = { $regex: searchPj, $options: 'i' }
        // }
        console.log('filter', filter)
        const result = await Message.find(filter, null, options)
            .populate({
                path: 'owner',
                select: '_id'
            })
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// get all pagination + search
router.get('/', async (req, res) => {
    try {
        const { search, orderBy, orderDir, userId, limit, page } = req.query
        console.log('req.query', req.query)
        let options = {
            page: page || 1,
            limit: 9 || limit,
            populate: {
                path: 'owner',
                select: '_id'
            },
            sort: { updatedAt: -1 }
        }
        const filter = {}
        if (search) {
            filter.name = { $regex: search, $options: 'i' }
        }
        if (userId) {
            filter.owner = userId
        }
        if (orderBy) {
            options.sort = { [orderBy]: orderDir || -1 }
        }
        // if (searchPj) {
        //     filter['attachments.oldName'] = { $regex: searchPj, $options: 'i' }
        // }
        console.log('filter', filter)
        const result = await Message.paginate(filter, options)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// save one
router.post('/', async (req, res) => {
    try {
        console.log('save discussion body', req.body)
        // console.log('save post files', req.file, req.files)
        const discussion = req.body // Discussion object
        // const files = req.files || []
        // const filesToSave = []
        // for (let i = 1; i < files.length; i += 2) {
        //     filesToSave.push(files[i])
        // }
        // data.image = files
        // const discussion = new Discussion(data)
        discussion.messages[0].sender = discussion.messages[0].sender._id
        delete discussion.messages[0]._id
        const message = discussion.messages && discussion.messages[0] ? new Message(discussion.messages[0]) : null
        if (message) {
            message.unread = true
            if (discussion._id) {
                message.discussion = discussion._id
                const savedMessage = await message.save(message)
                await Discussion.findOneAndUpdate({ _id: discussion._id }, { $push: { messages: message._id } })
                const toReturn = JSON.parse(JSON.stringify(savedMessage))
                toReturn.sender = { _id: toReturn.sender }
                return res.json(toReturn)
            }
            else {
                delete discussion._id
                discussion.messages = [message._id]
                const newDiscussion = new Discussion(discussion)
                await newDiscussion.save()
                message.discussion = newDiscussion._id
                const savedMessage = await message.save()
                const toReturn = JSON.parse(JSON.stringify(savedMessage))
                toReturn.sender = { _id: toReturn.sender }
                return res.json(toReturn)
            }
        }
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// update one
router.put('/', async (req, res) => {
    try {
        const data = req.body
        const filter = {}
        if (data._id) filter._id = data._id
        else {
            res.status(404).json({ success: false, msg: "ID required" })
            return
        }
        const post = await Message.findOneAndUpdate(filter, data)
        res.send(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;