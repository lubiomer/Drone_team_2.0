const router = require('express').Router();
const verifyToken = require('../util/verifyToken');
const { Comment } = require('../models/Comment');
const { ObjectId } = require("mongodb");

/**
 * @openapi
 * /api/comments/create:
 *   post:
 *     summary: Create a new comment
 *     description: Allows creation of a new comment by an admin or user.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - product
 *               - review
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The content of the comment.
 *               product:
 *                 type: string
 *                 description: The ID of the product associated with the comment.
 *               review:
 *                 type: string
 *                 description: The ID of the review associated with the comment.
 *     responses:
 *       200:
 *         description: Comment created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Comment data created successfully!
 *       400:
 *         description: Invalid input, object invalid.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: Server error occurred while creating the comment.
 */
router.post('/create', verifyToken(['admin', 'user']), async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 'error',
            message: 'You\'ve requested to create a new comment but the request body seems to be empty. Kindly pass the comment to be created using request body in application/json format',
            reasonPhrase: 'EmptyRequestBodyError'
        });
    }
    const commentData = {
        comment: req.body.comment,
        product: req.body.product,
        review: req.body.review,
        user: req.user._id,
    }

    try {
        await Comment.create(commentData);
        return res.status(200).send({ status: "success", message: "Comment data created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/comments/update/{id}:
 *   put:
 *     summary: Update an existing comment
 *     description: Allows updating an existing comment by its ID for admin or user.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the comment to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: JSON object containing values to update the comment.
 *     responses:
 *       200:
 *         description: Comment updated successfully.
 *       400:
 *         description: Invalid input, object invalid, or validation error has occurred.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: Server error occurred while updating the comment.
 */

router.put('/update/:id', verifyToken(['admin', 'user']), async (req, res) => {
    const updateValues = req.body;
    
    try {
        const updatedComment = await Comment.findOneAndUpdate({ _id: req.params.id }, updateValues, {
            new: true,
            runValidators: true,
        }).select('-__v');

        if (!updatedComment) {
            return res.status(404).send({ status: "error", message: "Comment not found." });
        }
        
        return res.status(200).send({ status: "success", message: "Comment updated successfully!", data: updatedComment });
    } catch (error) {
        if(error.name === "ValidationError") {
            return res.status(400).send({ status: "error", message: error.message });
        }
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Allows deletion of an existing comment by its ID for admin or user.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the comment to be deleted.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Comment deleted successfully!
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       404:
 *         description: Comment not found.
 *       500:
 *         description: An error occurred while deleting the comment.
 */
router.delete('/delete/:id', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const result = await Comment.deleteOne({ _id: new ObjectId(req.params.id) });

        // Check if any document was deleted.
        if (result.deletedCount === 0) {
            return res.status(404).send({ status: "error", message: "Comment not found!" });
        }

        return res.status(200).send({ status: "success", message: "Comment deleted successfully!" });
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Delete Review Error:", error);

        return res.status(500).send({ status: "error", message: "An error occurred while deleting the review." });
    }
});

module.exports = router;