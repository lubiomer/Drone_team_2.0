const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');

const uuid = () => {
    const head = Date.now().toString(32);
    const tail = Math.random().toString(32).substring(2);

    return head + tail;
}

const signToken = async (user) => {
    // Sign the access token
    const accessToken = jwt.sign({ _id: user.id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1d' });

    // Sign the refresh token
    const refreshToken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    // // Create a Session
    // redisClient.set(user.id, JSON.stringify(user), {
    //   EX: 60 * 60,
    // });

    // Return access token
    return { accessToken, refreshToken };
};

const getGoogleOauthToken = async ({ code }) => {
    const rootURl = 'https://oauth2.googleapis.com/token';
    const options = {
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
        grant_type: 'authorization_code',
    };

    try {
        const { data } = await axios.post(
            rootURl,
            qs.stringify(options),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return data;
    } catch (err) {
        console.log('Failed to fetch Google Oauth Tokens');
        throw new Error(err);
    }
}

const getGoogleUser = async ({ id_token, access_token }) => {

    try {
        const { data } = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        );

        return data;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}

module.exports = {
    uuid,
    signToken,
    getGoogleOauthToken,
    getGoogleUser,
}