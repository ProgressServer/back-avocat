const router = require('express').Router();
const userRouter = require('./user.routes');
const postRouter = require('./post.routes');
const droitRouter = require('./droit.routes');

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"] || req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};

router.use('/users', userRouter)
router.use('/posts', postRouter)
router.use('/droits', droitRouter)

router.get('/', (req, res) => {
    res.send({ message: 'Hello world' });
});

module.exports = router;