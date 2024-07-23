const router = require('express').Router();
const { uuid } = require('../util/utils');
const verifyToken = require('../util/verifyToken');
const multer = require("multer");
const { ObjectId } = require("mongodb");
const { Review } = require('../models/Review');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/reviews`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `review-${uuid()}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadReview = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

/**
 * @openapi
 * /api/reviews/productReviews/{productId}:
 *   get:
 *     summary: Retrieve product reviews
 *     description: Fetch all reviews for a product including associated comments and user details.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product to retrieve reviews for.
 *     responses:
 *       200:
 *         description: A list of product reviews with associated comments.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: An error occurred while fetching the reviews.
 */
router.get('/productReviews/:productId', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const { productId } = req.params;

        // Aggregate reviews related to the productId and look up associated comments.
        const reviewsWithComments = await Review.aggregate([
            { $match: { product: new ObjectId(productId) } }, // Match reviews for the product
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "review",
                    as: "comments"
                }
            },
            {
                $addFields: {
                    commentCounts: { $size: "$comments" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            // Lookup to fetch user details for each comment
            {
                $unwind: {
                    path: "$comments",
                    preserveNullAndEmptyArrays: true // Keep reviews without comments
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "comments.user",
                    foreignField: "_id",
                    as: "comments.userDetail"
                }
            },
            {
                $unwind: {
                    path: "$comments.userDetail",
                    preserveNullAndEmptyArrays: true  // Handle comments without user details
                }
            },
            {
                $group: {
                    _id: "$_id",
                    content: { $first: "$content" },
                    reviewImg: { $first: "$reviewImg" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    productDetails: { $first: "$productDetails" },
                    userDetails: { $first: "$userDetails" },
                    commentCounts: { $first: "$commentCounts" },
                    comments: { $push: "$comments" },
                    uniqueCommentUsers: { $addToSet: '$comments.userDetail' }
                }
            },
            {
                $unwind: "$productDetails" // Assuming there is always one matching product
            },
            {
                $unwind: "$userDetails" // Assuming there is always one matching user
            },
            { $sort: { createdAt: -1 } },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    reviewImg: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    product: "$productDetails", // Include product details
                    user: "$userDetails", // Include user details
                    comments: {
                        $cond: {
                            if: { $eq: ["$commentCounts", 0] },
                            then: [],
                            else: "$comments"
                        }
                    },
                    uniqueCommentUsers: 1,
                    commentCounts: 1 // Include the count of comments
                }
            }
        ]);

        return res.send({
            totalCount: reviewsWithComments.length,
            reviews: reviewsWithComments
        });

    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

router.post('/create', verifyToken(['admin', 'user']), async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 'error',
            message: 'You\'ve requested to create a new review but the request body seems to be empty. Kindly pass the review to be created using request body in application/json format',
            reasonPhrase: 'EmptyRequestBodyError'
        });
    }
    const reviewData = {
        content: req.body.content,
        product: req.body.product,
        reviewImg: req.body.reviewImg,
        user: req.user._id,
    }

    try {
        await Review.create(reviewData);
        return res.status(200).send({ status: "success", message: "Review data created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/reviews/update/{id}:
 *   put:
 *     summary: Update a review
 *     description: Updates the details of an existing review by its unique identifier.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the review to be updated.
 *     requestBody:
 *       description: Object containing the update values for the review.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Review Title"
 *               content:
 *                 type: string
 *                 example: "This is an updated review content."
 *     responses:
 *       200:
 *         description: The review was successfully updated.
 *       400:
 *         description: Bad request, validation error for input data.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       404:
 *         description: Review not found.
 *       500:
 *         description: An error occurred while updating the review.
 */

router.put('/update/:id', verifyToken(['admin', 'user']), async (req, res) => {
    const updateValues = req.body;

    try {
        const updatedReview = await Review.findOneAndUpdate({ _id: req.params.id }, updateValues, {
            new: true,
            runValidators: true,
        }).select('-__v');

        if (!updatedReview) {
            return res.status(404).send({ status: "error", message: "Review not found." });
        }

        return res.status(200).send({ status: "success", message: "Review updated successfully!", data: updatedReview });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).send({ status: "error", message: error.message });
        }
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/reviews/delete/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes an existing review by its unique identifier.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the review to be deleted.
 *     responses:
 *       200:
 *         description: The review was successfully deleted.
 *       400:
 *         description: Bad request, invalid format of the provided ID.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       404:
 *         description: Review not found or has already been deleted.
 *       500:
 *         description: An error occurred while deleting the review.
 */

router.delete('/delete/:id', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const result = await Review.deleteOne({ _id: new ObjectId(req.params.id) });

        // Check if any document was deleted.
        if (result.deletedCount === 0) {
            return res.status(404).send({ status: "error", message: "Review not found!" });
        }

        return res.status(200).send({ status: "success", message: "Review data deleted successfully!" });
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Delete Review Error:", error);

        return res.status(500).send({ status: "error", message: "An error occurred while deleting the review." });
    }
});

router.post('/upload/reviewImg', uploadReview.single('reviewImg'), verifyToken(['admin', 'user']), async (req, res) => {
    const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    return res.send({ imageUri: imageUri })
});

router.get('/myReviews', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('user') // This will include all fields from the User document.
            .populate('product'); // This will include all fields from the Product document.

        return res.send(reviews);
    } catch (error) {
        console.error(error); // Log the error for debugging.
        return res.status(500).send({ message: 'An error occurred while retrieving the reviews.' });
    }
});

module.exports = router;