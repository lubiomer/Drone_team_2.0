const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation } = require('../util/validate');
const User = require('../models/User');

const saltLength = 10;
let refreshTokens = [];

const authConfig = {
    expireTime: '1d',
    refreshTokenExpireTime: '1d',
};

// Endpoint: Register Users
router.post('/register', async (req, res) => {
    // validate request
    const { error } = registerValidation(req.body);

    if (error) return res.status(400).send(error.details[0].message);
    // check for unique user
    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) { return res.status(400).send('Username already exists'); }

    // hash the password
    const salt = await bcrypt.genSalt(saltLength);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashPassword,
        role: 'user',
    });

    // create an access token
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: authConfig.expireTime });

    try {
        const savedUser = await user.save();

        // remove password
        delete savedUser._doc.password;

        return res.send({ user: savedUser, accessToken, message: 'User successfully registered' });
    } catch (err) {
        return res.status(400).send(err);
    }
});

// Endpoint: Login user
router.post('/login', async (req, res) => {
    // validate request
    const { error } = loginValidation(req.body);
    if (error) { return res.status(400).send(error.details[0].message); }

    const user = await User.findOneAndUpdate({ username: req.body.username }, { lastLogin: new Date() }).select('-__v');
    if (!user) { return res.status(400).send({ message: 'Username provided is not a registered account' }); }
    if (user.role == 'admin') {
        return res.status(400).send({ message: 'User role is not allowed' });
    }
    const tokenExpiry = req.body.remember ? '60d' : authConfig.expireTime;
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send({ message: 'Username or password not found!' });

    // validation passed, create tokens
    const accessToken = jwt.sign({ _id: user._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: tokenExpiry });
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: authConfig.refreshTokenExpireTime });
    refreshTokens.push(refreshToken);

    // remove password
    delete user._doc.password;

    const userData = user;
    const response = {
        userData,
        accessToken,
        status: 'success'
    };
    res.cookie('refreshToken', refreshToken, {
        secure: process.env.NODE_ENV !== 'development',
        expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
        httpOnly: true,
    });
    return res.send(response);
});

module.exports = router;