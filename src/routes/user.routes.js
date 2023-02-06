const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const multer = require('multer')
const uuid = require('uuid')
const users = require('../models/user');
const unserDb = require('../db/user.db');
const userDb = require('../db/user.db');

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

const uploadMultiple = multer({
    storage,
    limits: {
        fileSize: maxSize * 1024 * 1024,
    },
}).array('image')

const handleUploadMultiple = (req, res, next) => {
    uploadMultiple(req, res, err => {
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

// search avocat
router.get('/search', async (req, res) => {
    try {
        const { search, orderBy, orderDir, speciality } = req.query
        console.log('req.query search users', req.query)
        let options = { sort: { firstname: 1 } }
        const filter = { roles: 'avocat' }
        if (search) {
            filter.$or = [{ firstname: { $regex: search, $options: 'i' } }, { lastname: { $regex: search, $options: 'i' } }]
        }
        if (speciality && speciality != '[]') {
            filter.speciality = { $in: JSON.parse(speciality) }
        }
        if (orderBy) {
            options = { sort: { [orderBy]: orderDir || -1 } }
        }
        // if (searchPj) {
        //     filter['attachments.oldName'] = { $regex: searchPj, $options: 'i' }
        // }
        console.log('filter', filter)
        const result = await User.find(filter, null, options)
            .populate({ path: 'follow', select: '_id' })
            .populate({ path: 'speciality' })
            .select('firstname lastname username speciality profilePicture')
        console.log('result', result);
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
        const result = await User.findOne(filter).select('-password')
            .populate({ path: 'follow', select: '_id' })
            .populate({ path: 'speciality', select: '_id' })
            .lean()
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.get('/', async (req, res) => {
    try {
        const filter = {}
        if (req.query.id) filter._id = req.query.id
        const result = await User.find(filter).select('-password')
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//signin
router.post('/login', async (req, res) => {
    try {
        const filter = {}
        let good = false
        if (req.body.email) filter.email = req.body.email
        else return res.status(400).json({ msg: 'Email requis' })
        // else return res.status(400).json({ msg: 'Nom d\'utilisateur requis' })
        const result = await User.findOne(filter).lean()
        if (!result) return res.status(404).json({ msg: 'Utilisateur non trouvé' })
        if (req.body.password) good = await bcrypt.compare(req.body.password, result.password)
        else return res.status(400).json({ msg: 'Mot de passe requis' })
        if (good) {
            const token = jwt.sign(
                { userId: result._id, email: result.email, username: result.usename },
                process.env.TOKEN_KEY,
                { expiresIn: "24h" }
            )
            delete result.password
            delete result.speciality
            res.send({ user: result, token })
        }
        else res.status(403).json({ msg: 'Mot de passe incorrect' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// signup user new
router.post('/', handleUpload, async (req, res) => {
    try {
        console.log('signup', JSON.parse(req.body.user))
        console.log('signup file', req.file)
        const bodyParsed = JSON.parse(req.body.user)
        const user = new User(bodyParsed)
        const result = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] })
        console.log('result', result)
        if (result) {
            res.status(409).json({ msg: "L'utilisateur existe déjà" })
            return
        }
        const speciality = bodyParsed.speciality
        user.speciality = speciality.map((e) => e._id)
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() + 1);
        user.activationLimit = dateLimit
        user.password = await bcrypt.hash(user.password, 10)
        user.activationCode = Math.floor(100000 + Math.random() * 900000)
        user.roles = []
        if (user.barreau) user.roles.push('avocat')
        else user.roles.push('justiciable')
        delete user._id
        if (req.file) user.licenceCard = req.file.filename
        await user.save()
        const newUser = await User.findOne({ email: user.email }).select('-password').lean()
        // delete newUser.password
        console.log('new', newUser)
        delete newUser.speciality
        res.send(newUser)
        // res.sendStatus(400)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.post('/User', handleUpload, async (req, res) => {
    try {
        console.log('signup', JSON.parse(req.body.user))
        console.log('signup file', req.file)
        const bodyParsed = JSON.parse(req.body.user)
        const user = new User(bodyParsed)
        const result = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] })
        console.log('result', result)
        if (result) {
            res.status(409).json({ msg: "L'utilisateur existe déjà" })
            return
        }
        const speciality = bodyParsed.speciality
        user.speciality = speciality.map((e) => e._id)
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() + 1);
        user.activationLimit = dateLimit
        user.password = await bcrypt.hash(user.password, 10)
        user.activationCode = Math.floor(100000 + Math.random() * 900000)
        user.roles = []
        if (user.barreau) user.roles.push('avocat')
        else user.roles.push('justiciable')
        delete user._id
        user.licenceCard = req.file.filename
        await user.save()
        const newUser = await User.findOne({ email: user.email }).select('-password').lean()
        // delete newUser.password
        console.log('new', newUser)
        delete newUser.speciality
        res.send(newUser)
        // res.sendStatus(400)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

//signup user old
// router.post('/', async (req, res) => {
//     try {
//         console.log('signup', req.body)
//         const user = new User(req.body)
//         const result = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] })
//         console.log('result', result)
//         if (result) {
//             res.status(409).json({ msg: "L'utilisateur existe déjà" })
//             return
//         }
//         const speciality = req.body.speciality
//         user.speciality = speciality.map((e) => e._id)
//         const dateLimit = new Date();
//         dateLimit.setDate(dateLimit.getDate() + 1);
//         user.activated = false
//         user.activationLimit = dateLimit
//         user.password = await bcrypt.hash(user.password, 10)
//         user.activationCode = Math.floor(100000 + Math.random() * 900000)
//         user.roles = []
//         if (user.barreau) user.roles.push('avocat')
//         else user.roles.push('justiciable')
//         delete user._id
//         await user.save()
//         const newUser = await User.findOne({ email: user.email }).select('-password').lean()
//         // delete newUser.password
//         console.log('new', newUser)
//         delete newUser.speciality
//         res.send(newUser)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({ msg: error })
//     }
// })

// check code after signin
router.post('/check-code', async (req, res) => {
    try {
        console.log('check-code', req.body)
        const data = req.body
        const result = await User.findOne({ _id: data._id })
        console.log('result', result)
        if (!result) {
            return res.status(404).json({ msg: "L'utilisateur est introuvable" })
        }
        // if (data.activationCode === result.activationCode) {
        //     result.activated = true
        //     result.save()
        //     return res.json({ msg: 'Activation du compte réussie' })
        // }
        if ('111111' === data.activationCode) {
            result.activated = true
            result.save()
            return res.json({ msg: 'Activation du compte réussie' })
        }
        else {
            res.status(400).json({ msg: "Le code saisi est incorrect" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

// follow
router.post('/follow', async (req, res) => {
    try {
        console.log('check-code', req.body)
        const { followerList, userId } = req.body
        await User.findOneAndUpdate({ _id: userId }, { $set: { follow: followerList } })
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.put('/', handleUploadMultiple, async (req, res) => {
    try {
        const data = req.body
        const userData = JSON.parse(JSON.parse(data.user))
        console.log('update user', userData)
        // console.log('req.file', req.file)
        console.log('req.files', req.files)
        if (req.files && req.files.length > 0) {
            userData.profilePicture = req.files[0] ? req.files[0].filename : null
            userData.licenceCard = req.files[1] ? req.files[1].filename : null
        }
        const filter = {}
        if (userData.id) filter._id = userData.id
        else {
            res.status(404).send("ID required")
            return
        }
        delete userData.roles
        delete userData.password
        if (userData.speciality) userData.speciality = userData.speciality.map((e) => e.id)
        const user = await User.findOneAndUpdate(filter, userData, { new: true })
        const toSend = JSON.parse(JSON.stringify(user))
        console.log('before', toSend);
        const speciality = []
        for (const spec of toSend.speciality) {
            speciality.push({ id: spec })
        }
        toSend.speciality = speciality
        console.log(toSend);
        res.send(toSend)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.get('/user/generate', async (req, res) => {
    try {
        console.log('generate user')
        const result = await User.insertMany(userDb)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;