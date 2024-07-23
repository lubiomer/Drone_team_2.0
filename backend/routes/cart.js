const router = require('express').Router();
const { Cart } = require('../models/Cart');
const { Order } = require('../models/Order');
const { Product } = require('../models/Product');
const verifyToken = require('../util/verifyToken');
const { ObjectId } = require('mongodb');

/**
 * @openapi
 * /api/carts/create:
 *   post:
 *     summary: Create a new cart entry
 *     description: Adds a product along with the desired quantity to the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *                 description: The unique identifier of the product to be added to the cart.
 *               quantity:
 *                 type: number
 *                 description: The quantity of the product to add to the cart.
 *     responses:
 *       200:
 *         description: The cart data was created successfully.
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
 *                   example: The Cart data created successfully!
 *       400:
 *         description: Bad request, not enough stock or other validation error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: You can't cart the quantity, there is not enough.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: Server error occurred while creating the cart data.
 */
router.post('/create', verifyToken(['admin', 'user']), async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).send({
            status: 'error',
            message: 'You\'ve requested to create a new cart but the request body seems to be empty. Kindly pass the cart to be created using request body in application/json format',
            reasonPhrase: 'EmptyRequestBodyError'
        });
    }
    const { product, quantity } = req.body;
    const userId = req.user._id;
    try {
        await Cart.create({
            product: product,
            user: userId,
            quantity: quantity
        });
        let productData = await Product.findById(new ObjectId(product));
        let changedStock = parseFloat(productData.stock) - parseFloat(quantity);
        if (changedStock <= 0) return res.status(400).send({ status: "error", message: "You can't cart the quantity, there is not enough." });
        await Product.findOneAndUpdate({ _id: new ObjectId(product) }, { stock: changedStock });
        return res.status(200).send({ status: "success", message: "Cart data created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/carts/mycart:
 *   get:
 *     summary: Retrieve the current user's cart
 *     description: Fetches all active cart items for the currently authenticated user along with product details.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: An array of cart items.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Unique identifier for the cart item.
 *                   user:
 *                     type: object
 *                     description: Details of the user who owns the cart.
 *                     properties:
 *                       _id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                   product:
 *                     type: object
 *                     description: Details of the added product.
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
 *                     description: Quantity of the product in the cart.
 *                   status:
 *                     type: string
 *                     description: Status of the cart item, e.g., active.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: Server error occurred while retrieving the cart data.
 */
router.get('/mycart', verifyToken(['admin', 'user']), async (req, res) => {
    const myCarts = await Cart.find({ user: new ObjectId(req.user._id), status: 'active' })
        .populate({
            path: 'user',
            select: {
                _id: 1, username: 1, firstname: 1, lastname: 1, email: 1, role: 1,
            },
        })
        .populate({ 
            path: 'product',
            select: {
                _id: 1, name: 1, detail: 1, stock: 1, price: 1, productImg: 1,
            },
        }).select('-__v');

    return res.send(myCarts);
});

/**
 * @swagger
 * /api/carts/delete:
 *   delete:
 *     summary: Delete a cart by its ID
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartId
 *             properties:
 *               cartId:
 *                 type: string
 *                 description: The cart ID to delete
 *     responses:
 *       200:
 *         description: The Cart data deleted successfully!
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
 *                   example: The Cart data deleted successfully!
 *       400:
 *         description: Bad request when the required fields are not provided
 *       500:
 *         description: When an error occurs on the server side
 */
router.delete('/delete/:id', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        await Cart.findOneAndUpdate({ _id: new ObjectId(req.params.id) }, { status: 'deleted' }, { new: true });
        return res.send({ status: "success", message: "The Cart data deleted successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
});

/**
 * @swagger
 * /api/carts/checkout:
 *   post:
 *     summary: Process a checkout operation
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: string
 *                   example: "663f1cdeeca0a2250f188275"
 *                 name:
 *                   type: string
 *                   example: "aaaa"
 *                 price:
 *                   type: number
 *                   example: 12
 *                 product:
 *                   type: string
 *                   example: "663f1cdeeca0a2250f188275"
 *                 quantity:
 *                   type: integer
 *                   example: 3
 *                 totalPrice:
 *                   type: number
 *                   example: 233
 *                 user:
 *                   type: string
 *                   example: "663f1cdeeca0a2250f188275"
 *     responses:
 *       200:
 *         description: Checkout processed successfully!
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
 *                   example: Checkout successfully!
 *       400:
 *         description: Bad request when the required fields are not provided or invalid
 *       500:
 *         description: When an error occurs on the server side
 */

router.post('/checkout', verifyToken(['admin', 'user']), async (req, res) => {
    const postCheckoutData = req.body;
    let cartIds = postCheckoutData.map(checkData => new ObjectId(checkData.cart));
    try {
        await Cart.updateMany({ _id: { $in: cartIds } }, { $set: { status: "deleted" } }, { new: true });
        await Order.insertMany(postCheckoutData);
        return res.send({ status: "success", message: "Checkout successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
});

module.exports = router;