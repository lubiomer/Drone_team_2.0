const router = require('express').Router();
const User = require("../models/User");
const { uuid } = require('../util/utils');
const verifyToken = require('../util/verifyToken');
const multer = require("multer");
const { ObjectId } = require("mongodb");

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `public/img/profiles`);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `profile-${uuid()}-${Date.now()}.${ext}`;
        cb(null, filename);
    }
});

const uploadProfile = multer({
    storage: multerStorage,
    limits: { fileSize: 1024 * 1024 * 5, files: 1 },
});


/**
 * @openapi
 * /api/users:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns a list of users
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: A list of users.
 *       401:
 *         description: Unauthorized, missing or invalid token.
 */
router.get('/', verifyToken(['admin', 'user']), async (req, res) => {
    const roleFilter = req.query.role !== '' && typeof req.query.role !== 'undefined' ? { role: req.query.role } : {};
    const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
    const filterParams = {
        $and: [
            {
                $or: [
                    { firstname: { $regex: searchQuery, $options: 'i' } },
                    { lastname: { $regex: searchQuery, $options: 'i' } },
                    { email: { $regex: searchQuery, $options: 'i' } },
                ],
            },
            roleFilter
        ],
    };
    const totalCount = await User.countDocuments({});
    const users = await User.find(filterParams).select('-password -__v');

    return res.send({
        totalCount,
        users,
        filteredCount: users.length,
    })
});

/**
 * @openapi
 * /api/users/personal/me:
 *   get:
 *     summary: Get the personal information of the logged-in user
 *     description: Retrieve personal information for the current authenticated user.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully retrieved user details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     firstname:
 *                       type: string
 *                     lastname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get('/personal/me', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password -__v');
        return res.send({ user: user });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});


/**
 * @openapi
 * /api/users/logout:
 *   get:
 *     summary: Log out the current user
 *     description: Clear cookies to log the user out of the application.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'successfully logout'
 *       500:
 *         description: Internal server error
 */
router.get('/logout', async (req, res) => {
    try {
        res.cookie('refreshToken', '', { maxAge: 1 });
        res.cookie('isLoggedIn', '', { maxAge: 1 });
        return res.status(200).send({ message: 'successfully logout' });
    } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @openapi
 * /api/users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by ID. Only accessible by users with 'admin' role.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to be deleted.
 *     responses:
 *       200:
 *         description: User successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully deleted!
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, user does not have necessary permissions.
 *       404:
 *         description: User not found with the given ID.
 *       500:
 *         description: Server error occurred while deleting the user.
 */

router.delete('/delete/:id', verifyToken(['admin']), async (req, res) => {
    await User.deleteOne({ _id: req.params.id });
    return res.send({ message: 'User successfully deleted!' });
});

/**
 * @openapi
 * /api/users/update/profile:
 *   put:
 *     summary: Update a user's details
 *     description: Allows updating of a user's username, first name, last name, and email. Access requires 'admin' or 'user' role.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *             example:
 *               username: johndoe
 *               firstname: John
 *               lastname: Doe
 *               email: johndoe@example.com
 *     responses:
 *       200:
 *         description: User successfully updated.
 *       400:
 *         description: Bad Request, invalid input data or duplicated username.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       403:
 *         description: Forbidden action, insufficient permissions.
 *       404:
 *         description: User not found with the given ID.
 *       500:
 *         description: An unexpected error occurred.
 */

router.put('/update/profile', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const updateValues = req.body;
        const updatedUser = await User.findOneAndUpdate({ _id: req.user._id }, updateValues, {
            new: true,
        }).select('-__v');

        if (!updatedUser) {
            return res.status(404).send({ message: 'User not found' });
        }

        return res.send({ updatedUser: updatedUser, message: 'User successfully updated' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).send({ message: 'Duplicated username, there is already an existing username' });
        }
        return res.status(500).send({ message: error.message || 'An unexpected error occurred' });
    }
});

/**
 * @openapi
 * /api/users/getProfile:
 *   get:
 *     summary: Retrieve the profile of the currently logged-in user
 *     description: Returns the user's profile information along with associated orders, carts, and last flight details. Access requires 'admin' or 'user' role.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 firstname:
 *                   type: string
 *                 lastname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *                       totalPrice:
 *                         type: number
 *                       cart:
 *                         type: boolean
 *                       user:
 *                         type: string
 *                       products:
 *                         type: array
 *                 carts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       count:
 *                         type: integer
 *                 lastFlight:
 *                   type: array
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: An unexpected error occurred.
 */

router.get('/getProfile', verifyToken(['admin', 'user']), async (req, res) => {
    try {
        const user = await User.aggregate(
            [
                { $match: { _id: new ObjectId(req.user._id) }},
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'user',
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'products',
                                    localField: 'product',
                                    foreignField: '_id',
                                    as: 'products',
                                }, 
                            },
                            {
                                $project: {
                                    _id: 1,
                                    quantity: 1,
                                    totalPrice: 1,
                                    cart: 1,
                                    user: 1,
                                    products:1,
                                }, 
                            }
                        ],
                        as: 'orders',
                    },
                },
                {
                    $sort: { 'orders.createdAt': -1 } 
                },
                {
                    $lookup: {
                        from: 'carts',
                        localField: '_id',
                        foreignField: 'user',
                        pipeline: [
                            { $match: { status: { $ne: 'deleted'} } }, 
                            { $group: { _id: null, count: { $sum: 1 } } },
                        ],
                        as: 'carts',
                    },     
                },
                {
                    $lookup: {
                        from: 'flights',
                        localField: '_id',
                        foreignField: 'user',
                        pipeline: [
                            { $match: { user: new ObjectId(req.user._id) } }, 
                            { $sort: { 'flights.createdAt': -1 }  },
                            { $limit: 1 }
                        ],
                        as: 'lastFlight',
                    },     
                },
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        firstname: 1,
                        lastname: 1,
                        email: 1,
                        role: 1,
                        orders: 1,
                        carts: 1,
                        lastFlight: 1
                    }, 
                }
            ]
        );
        return res.send(user[0]);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
});

/**
 * @openapi
 * /api/users/upload/avatarFile:
 *   put:
 *     summary: Upload and update user's avatar.
 *     description: Allows users to upload a new avatar image. The server stores the image and updates user's profile with the new avatar URL.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatarFile:
 *                 type: string
 *                 format: binary
 *                 description: The avatar image file to upload.
 *     responses:
 *       200:
 *         description: Avatar updated successfully.
 *       400:
 *         description: Bad request, if the file is not provided or invalid.
 *       401:
 *         description: Unauthorized access, invalid or missing token.
 *       500:
 *         description: An unexpected error occurred.
 */

router.put('/upload/avatarFile', uploadProfile.single('avatarFile'), verifyToken(['admin', 'user']), async (req, res) => {
    const imageUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');
    const updateAvatar = await User.findOneAndUpdate({ _id: req.user._id }, { avatar: imageUri }, { new: true }).select('-password -__v');

    return res.send({ updateAvatar: updateAvatar })
});

module.exports = router;

