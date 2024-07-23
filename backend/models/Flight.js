const mongoose = require("mongoose");

const flightSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        date: { type: Date, required: true },
        item: { type: String, required: true },
        duration: { type: Number, required: true },
        location: { type: String, required: true },
        comment: { type: String, required: true },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

const Flight = mongoose.model("Flight", flightSchema);

module.exports = { Flight } 