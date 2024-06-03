const router = require('express').Router();
const { Product } = require('../models/Product');
const { uuid } = require('../util/utils');
const verifyToken = require('../util/verifyToken');
const multer = require("multer");
const mongoose = require('mongoose');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/products`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `product-${uuid()}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadProduct = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});

/**
 * @openapi
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the provided data. Requires token authentication.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - detail
 *               - stock
 *               - price
 *               - productImg
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *                 example: "Sample Drone"
 *               detail:
 *                 type: string
 *                 description: Detailed description of the product.
 *                 example: "An advanced drone with 4K camera support."
 *               stock:
 *                 type: integer
 *                 description: The stock quantity of the product.
 *                 example: 15
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *                 example: 999
 *               productImg:
 *                 type: string
 *                 description: URL to the image of the product.
 *                 example: "http://example.com/images/drone.jpg"
 *     responses:
 *       200:
 *         description: Product created successfully.
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
 *                   example: "The Product data created successfully!"
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: Error occurred while creating the product.
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
 *                   example: "Unable to create product. Please try again later."
 */
router.post('/create', verifyToken(['admin']), async (req, res) => {
    const productData = {
        name: req.body.name,
        detail: req.body.detail,
        stock: req.body.stock,
        price: req.body.price,
        productImg: req.body.productImg,
    }
    
    try {
        await Product.create(productData);
        return res.status(200).send({ status: "success", message: "The Product data created successfully!" });
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/products/upload/productImg:
 *   post:
 *     summary: Upload a product image
 *     description: Allows uploading an image for the product. Requires admin privilege.
 *     tags:
 *       - Product Image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImg:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload.
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUri:
 *                   type: string
 *                   example: "http://server.url/images/uploaded_product_image.jpg"
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: Error occurred while uploading the image.
 */
router.post('/upload/productImg', uploadProduct.single('productImg'), verifyToken(['admin']), async (req, res) => {
    const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    return res.send({ imageUri: imageUri })
});


/**
 * @openapi
 * /api/products:
 *   get:
 *     summary: Get a list of products
 *     description: Retrieves a paginated list of products with optional query parameters for pagination. Accessible by users with 'admin' or 'user' roles.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number for pagination.
 *     responses:
 *       200:
 *         description: A list of products and counts.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: Server error occurred while fetching products.
 */
router.get('/', verifyToken(['admin', 'user']), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    try {
        const totalCount = await Product.countDocuments({});
        const products = await Product.find().skip(skip).limit(limit).select("-__v");
        return res.send({
            totalCount,
            products,
            filteredCount: products.length,
        })
    } catch (error) {
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/products/update/{id}:
 *   put:
 *     summary: Update a product
 *     description: Updates the specified product by its ID with the provided update fields. Accessible only by users with 'admin' role.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *                 example: "Sample Drone"
 *               detail:
 *                 type: string
 *                 description: Detailed description of the product.
 *                 example: "An advanced drone with 4K camera support."
 *               stock:
 *                 type: integer
 *                 description: The stock quantity of the product.
 *                 example: 15
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the product.
 *                 example: 999
 *               productImg:
 *                 type: string
 *                 description: URL to the image of the product.
 *                 example: "http://example.com/images/drone.jpg"
 *             required:
 *               - name
 *               - detail
 *               - stock
 *               - price
 *     responses:
 *       200:
 *         description: The Product data updated successfully.
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
 *                   example: The Product data updated successfully!
 *       400:
 *         description: Bad request, when the update payload is malformed.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       404:
 *         description: Product not found with the given ID.
 *       500:
 *         description: Server error occurred while updating the product.
 */
router.put('/update/:id', verifyToken(['admin']), async (req, res) => {
    const updateValues = req.body;
    
    try {
        const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.id }, updateValues, {
            new: true,
            runValidators: true,
        }).select('-__v');

        if (!updatedProduct) {
            return res.status(404).send({ status: "error", message: "Product not found." });
        }
        
        return res.status(200).send({ status: "success", message: "The Product data updated successfully!", data: updatedProduct });
    } catch (error) {
        if(error.name === "ValidationError") {
            return res.status(400).send({ status: "error", message: error.message });
        }
        return res.status(500).send({ status: "error", message: error.message });
    }
});

/**
 * @openapi
 * /api/products/getProduct/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve a single product by its unique identifier. Accessible by users with 'admin' or 'user' role.
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the product to retrieve.
 *     responses:
 *       200:
 *         description: Returns the requested product data.
 *       400:
 *         description: Bad request, malformed product id or product not found.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       500:
 *         description: Server error occurred while fetching the product.
 */
router.get('/getProduct/:id', verifyToken(['admin', 'user']), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send('Malformed product id');
    }

    const product = await Product.findById(req.params.id).select('-__v');
    if (!product) {
        return res.status(400).send('user not found');
    }
    return res.send(product);
});

/**
 * @swagger
 * /api/products/getDashboard:
 *   get:
 *     tags:
 *       - Product
 *     summary: Retrieve a list of top 3 products
 *     description: Get a short list of the top 3 products for the dashboard.
 *     responses:
 *       200:
 *         description: A list of products.
 *       500:
 *         description: Error fetching dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching dashboard data
 */
router.get('/getDashboard', async (req, res) => {
    try {
        const products = await Product.find().limit(3);
        return res.send(products);
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching dashboard data:', error);

        // Send an appropriate HTTP response indicating server error
        return res.status(500).send({ message: 'Error fetching dashboard data' });
    }
});


module.exports = router;