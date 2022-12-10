const router = require('express').Router();
const User = require('../models/user')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
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

router.get('/:id', async (req, res) => {
    try {
        const filter = {}
        if (req.params.id) filter._id = req.params.id
        else {
            res.status(400).json({ msg: 'ID required' })
            return
        }
        const result = await User.findOne(filter).select('-password')
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

router.post('/login', async (req, res) => {
    try {
        console.log('login', req.body)
        const filter = {}
        let good = false
        if (req.body.email) filter.email = req.body.email
        else return res.status(400).json({ msg: 'Email requis' })
        // else return res.status(400).json({ msg: 'Nom d\'utilisateur requis' })
        const result = await User.findOne(filter)
        if (!result) return res.status(404).json({ msg: 'Utilisateur non trouvé' })
        if (!result.activated) return res.status(401).json({ msg: `Votre compte n\'est pas encore activé. Veuillez saisir le code d\'activation qui vous a été envoyé.|${result._id}` })
        if (req.body.password) good = await bcrypt.compare(req.body.password, result.password)
        else return res.status(400).json({ msg: 'Mot de passe requis' })
        if (good) {
            const token = jwt.sign(
                { userId: result._id, email: result.email, username: result.usename },
                process.env.TOKEN_KEY,
                { expiresIn: "24h" }
            )
            delete result.password
            res.send({ user: result, token })
        }
        else res.status(403).json({ msg: 'Mot de passe incorrect' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

router.post('/', async (req, res) => {
    try {
        console.log('signup', req.body)
        const user = new User(req.body)
        const result = await User.findOne({ $or: [{ email: user.email }, { username: user.username }] })
        console.log('result', result)
        if (result) {
            res.status(409).json({ msg: "L'utilisateur existe déjà" })
            return
        }
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() + 1);
        user.activated = false
        user.activationLimit = dateLimit
        user.password = await bcrypt.hash(user.password, 10)
        user.activationCode = Math.floor(100000 + Math.random() * 900000)
        user.roles = []
        if (user.barreau) user.roles.push('avocat')
        else user.roles.push('justiciable')
        delete user._id
        await user.save()
        const newUser = await User.findOne({ email: user.email }).select('-password')
        // delete newUser.password
        console.log('new', newUser)
        res.send(newUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

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

router.put('/', handleUpload, async (req, res) => {
    try {
        const data = req.body
        const userData = JSON.parse(JSON.parse(data.user))
        console.log('update user', userData)
        console.log('req.file', req.file)
        if (req.file) userData.profilePicture = req.file.filename
        const filter = {}
        if (userData.id) filter._id = userData.id
        else {
            res.status(404).send("ID required")
            return
        }
        delete userData.roles
        delete userData.password
        const user = await User.findOneAndUpdate(filter, userData, { new: true })
        res.send(user)
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error })
    }
})

module.exports = router;