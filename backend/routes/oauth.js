const User = require('../models/User');
const { signToken, getGoogleOauthToken, getGoogleUser } = require('../util/utils');

const router = require('express').Router();


router.get('/google', async (req, res) => {
    try {
        // Get the code from the query
        const code = req.query.code;
        const pathUrl = req.query.state || "/";

        if (!code) {
            return next(new AppError("Authorization code not provided!", 401));
        }

        // Use the code to get the id and access tokens
        const { id_token, access_token } = await getGoogleOauthToken({ code });
        // Use the token to get the User
        const { name, verified_email, email, picture } = await getGoogleUser({
            id_token,
            access_token,
        });

        // Check if user is verified
        if (!verified_email) {
            return next(new AppError("Google account not verified", 403));
        }

        const user = await User.findOneAndUpdate({ email: email }, {
            username: name,
            avatar: picture,
            email,
            provider: "Google",
            verified: true,
            role: 'user',
        }, { upsert: true, runValidators: false, new: true, lean: true }).select('-password -__v');

        if (!user) {
            return res.redirect(`http://localhost:7000/oauth/error`);
        }

        // Create access and refresh token
        const { accessToken, refreshToken } = await signToken(user);

        // Send cookie
        res.cookie("accessToken", accessToken, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        res.cookie("refreshToken", refreshToken, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
            httpOnly: true,
        });
        res.cookie('isLoggedIn', true, {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 30 * 1440 * 60 * 1000),
            httpOnly: false,
        });
        res.cookie("userData", JSON.stringify(user), {
            secure: process.env.NODE_ENV !== 'development',
            expires: new Date(new Date().getTime() + 200 * 1440 * 60 * 1000),
            httpOnly: false,
        });

        return res.redirect(`http://localhost:7000${pathUrl}`);
    } catch (err) {
        console.log("Failed to authorize Google User", err);
        return res.redirect(`http://localhost:7000/oauth/error`);
    }

});

module.exports = router;