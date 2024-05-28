const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3008;

// Connect to DB
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // Connection successful
        console.log('👓 Connected to DB')
    })
    .catch((error) => {
        // Handle connection error
        console.log('Connection Error => : ', error.message)
    });

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const supportRoute = require('./routes/support');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const purchaseRoute = require('./routes/purchase');
const flightRoute = require('./routes/flight');

// increase parse limit
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '/public')));

// Middleware
app.use(
    cors({
        credentials: true,
        origin: [
            'http://localhost:7000'
        ],
    }),
);

app.use(express.json());
app.use(cookieParser());

// Route middleware
app.get('/', (req, res) => {
    res.send('Drone API Server is running!');
});

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/support', supportRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute);
app.use('/api/purchase', purchaseRoute);
app.use('/api/flight', flightRoute);

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Drone API',
            version: '1.0.0',
            description: 'API Documentation for Drone Service'
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
            }
          }
        },
    },
    apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(PORT, () => console.log(`🛺  API Server UP and Running at ${process.env.SERVER_URL}`));