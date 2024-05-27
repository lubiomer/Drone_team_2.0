const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_APIKEY);

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

        return res.status().send({ status: 'success', message: 'message sent'});
    } catch(error) {
        return res.status(500).send({ status: 'error', message: error.response.body.errors[0].message })
    }
});

module.exports = router;