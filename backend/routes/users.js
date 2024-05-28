const router = require('express').Router();
const User = require("../models/User");
const verifyToken = require('../util/verifyToken');


router.get('/personal/me', verifyToken(['admin', 'user']), async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');

    return res.send({ user: user })
});

router.get('/logout', async (req, res) => {
    res.cookie('refreshToken', '', { maxAge: 1 });
    return res.status(200).send({ message: 'successfully logout' })
});

module.exports = router;