const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
    },
    provider: {
        type: String,
        enum: ['Google', 'Username'],
        default: 'Username',
    },
    verified: {
        type: Boolean,
        default: false,
    },
    avatar: {
        type: String,
        default: '',
    },
    lastLogin: {
        type: Date,
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    },
});

module.exports = mongoose.model('User', userSchema);
