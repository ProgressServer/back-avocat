const router = require('express').Router();
const Post = require('../models/post')
const multer = require('multer')
const uuid = require('uuid')

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
        const result = await Post.findOne(filter)
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
        let options = { sort: { updatedAt: -1 } }
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
        const result = await Post.find(filter, null, options)
            .populate({
                path: 'owner',
                select: '_id firstname lastname username profilePicture'
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
        const result = await Post.paginate(filter, options)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// save one
router.post('/', handleUpload, async (req, res) => {
    try {
        console.log('save post body', req.body)
        console.log('save post typoe', req.headers['content-type'])
        console.log('save post files', req.file)
        const data = req.body
        // const files = req.files || []
        // const filesToSave = []
        // for (let i = 1; i < files.length; i += 2) {
        //     filesToSave.push(files[i])
        // }
        // data.image = files
        data.image = req.file.filename
        const imageThumbnail = require('image-thumbnail');
        const fs = require('fs');
        const thumbnail = await imageThumbnail(`./uploads/${req.file.filename}`, { responseType: 'base64' });
        const thumbnailName = `thmbnl-${req.file.filename}`
        fs.writeFileSync(`./uploads/${thumbnailName}`, thumbnail, 'base64')
        data.thumbnail = thumbnailName
        let post = new Post(data)

        post = await post.save()
        const newPost = JSON.parse(JSON.stringify(post))
        newPost.owner = { id: newPost.owner }
        console.log('new', newPost)
        res.send(newPost)
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
        const post = await Post.findOneAndUpdate(filter, data)
        res.send(post)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;