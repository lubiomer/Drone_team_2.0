const router = require('express').Router();
const User = require("../models/User");
const verifyToken = require('../util/verifyToken');

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
                    { firstName: { $regex: searchQuery, $options: 'i' } },
                    { lastName: { $regex: searchQuery, $options: 'i' } },
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


module.exports = router;