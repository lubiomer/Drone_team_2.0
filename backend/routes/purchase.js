const router = require('express').Router();
const { Order } = require('../models/Order');
const verifyToken = require('../util/verifyToken');

/**
 * @swagger
 * /api/purchase:
 *   get:
 *     summary: Retrieves the list of purchase orders by the user
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of purchases.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "5e9f8f8f8f8f8f8f8f8f8f8"
 *                   product:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       detail:
 *                         type: string
 *                       stock:
 *                         type: number
 *                       price:
 *                         type: number
 *                       productImg:
 *                         type: string
 *                   quantity:
 *                     type: number
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized. Token not provided or invalid.
 */
router.get('/', verifyToken(['user']), async (req, res) => {

    const purchases = await Order.find({ user: req.user._id })
        .populate({
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');

    return res.send(purchases);
});

module.exports = router;