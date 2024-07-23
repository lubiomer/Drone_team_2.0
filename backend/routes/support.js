const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

/**
 * @openapi
 * /api/support:
 *   post:
 *     summary: Send a support email
 *     description: Sends an email to the specified address with the provided content.
 *     tags:
 *       - Support
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the recipient.
 *                 example: user@example.com
 *               content:
 *                 type: string
 *                 description: The content of the support message.
 *                 example: Your support request has been received and is being reviewed.
 *     responses:
 *       200:
 *         description: Message sent successfully
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
 *                   example: message sent
 *       500:
 *         description: Error occurred while sending the message
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
 *                   example: Unable to send email. Please try again later.
 */
router.post('/', async (req, res) => {
    const { email, content } = req.body;
    const htmlContent = `
        <p>Hi,</p>
        <p>${content}</p>
        <p>Thank you!</p>
    `;

    const msg = {
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: `Drone Support`,
        html: htmlContent,
    };

    try {
        await sgMail.send(msg);

        return res.status(200).send({ status: 'success', message: 'message sent'});
    } catch(error) {
        return res.status(500).send({ status: 'error', message: error.response.body.errors[0].message })
    }
});


module.exports = router;