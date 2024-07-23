const router = require('express').Router();
const { Order } = require('../models/Order');
const verifyToken = require('../util/verifyToken');

/**
 * @openapi
 * /api/dashboard/:
 *   get:
 *     summary: Retrieve order statistics
 *     description: >
 *       Fetches order statistics including counts, quantities, and total prices
 *       grouped by each user.
 *     tags:
 *       - Admin Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data for all orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userData:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Usernames of users who have placed orders.
 *                 countData:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Number of orders per user.
 *                 quantityData:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Total quantity ordered per user.
 *                 totalPriceData:
 *                   type: array
 *                   items:
 *                     type: number
 *                   description: Total price for orders per user.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: Server error occurred while retrieving order statistics.
 */
router.get('/', verifyToken(['admin']), async (req, res) => {
    try {
        const results = await Order.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'users',
                }, 
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $group: {
                _id: { user: "$users.username" },
                count: { $sum: 1 },
                quantity: { $sum: "$quantity" },
                totalPrice: { $sum: "$totalPrice" },
              }
            }
        ]);
        let statistics = {};
        let countData = [];
        let userData = [];
        let quantityData = [];
        let totalPriceData = [];
        for (let result of results) {
            userData.push(result._id.user[0])
            countData.push(result.count);
            quantityData.push(result.quantity);
            totalPriceData.push(result.totalPrice);
        }
        statistics.userData = userData;
        statistics.countData = countData;
        statistics.quantityData = quantityData;
        statistics.totalPriceData = totalPriceData;
        return res.send(statistics);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = router;
