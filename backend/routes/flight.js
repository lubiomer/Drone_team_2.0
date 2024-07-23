const router = require('express').Router();
const { Flight } = require('../models/Flight');
const verifyToken = require('../util/verifyToken');

/**
 * @swagger
 * /api/flight/create:
 *   post:
 *     summary: Create a new flight entry
 *     tags:
 *       - Flight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - item
 *               - duration
 *               - location
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-04-15T09:00:00Z"
 *               item:
 *                 type: string
 *                 example: "Airbus A320"
 *               duration:
 *                 type: number
 *                 example: 5
 *               location:
 *                 type: string
 *                 example: "Los Angeles International Airport"
 *               comment:
 *                 type: string
 *                 example: "Smooth flight with no turbulence."
 *     responses:
 *       200:
 *         description: The Flight data created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "The Flight data created successfully!"
 *       400:
 *         description: Error occurred during creation of flight data.
 */

router.post('/create', verifyToken(['user']), async (req, res) => {

    const flightData = {
        date: req.body.date,
        item: req.body.item,
        duration: req.body.duration,
        location: req.body.location,
        comment: req.body.comment,
        user: req.user._id,
    }

    try {
        await Flight.create(flightData);
        return res.send({ status: "success", message: "The Flight data created successfully!" });
    } catch (error) {
        return res.send({ status: "error", message: error.message });
    }
});

module.exports = router;