const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        content: {
            type: String,
            required: true
        },
        reviewImg: {
            type: String,
            required: true
        },
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
    }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = { Review } 