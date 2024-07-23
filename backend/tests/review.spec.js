'use strict';

const expect = require('chai').expect;
const request = require('request-promise');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getMongodbCollection } = require('../config/dbConfig');

const sampleUser = {
    "_id": new ObjectId(),
    "username": "JohnDoe1",
    "firstname": "John1",
    "lastname": "Doe1",
    "email": "john1@gmail.com",
    "password": "$2b$10$HBU32JOg0AmSurTSMAlsauxN.48lLdtR/BdLPRfckyskJNEmnpKTK",
    "role": "user",
}

const sampleProduct = {
    "_id": new ObjectId(),
    "name": "Drone1",
    "detail": "Which drone with camera is right for you? Discover the best camera drones like DJI Mavic 3 Pro, DJI Mini 3 Pro, DJI Air 2S and more!",
    "stock": 30,
    "price": 200,
    "productImg": "https://www1.djicdn.com/cms/uploads/dcac901a90cca9cee4020203b03f500b.png"
}

const sampleReview = {
    "content": "Which drone with camera is right for you? Discover the best camera drones like DJI Mavic 3 Pro, DJI Mini 3 Pro, DJI Air 2S and more!",
    "product": sampleProduct._id,
    "reviewImg": "https://www1.djicdn.com/cms/uploads/dcac901a90cca9cee4020203b03f500b.png",
}

describe('Create Review', () => {
    const accessToken = jwt.sign({ _id: sampleUser._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1d' });
    before(async () => {
        const collection = await getMongodbCollection('users');
        const collectionProducts = await getMongodbCollection('products');
        await collection.insertOne(sampleUser);
        await collectionProducts.insertOne(sampleProduct);
    });

    it('should return status code 400 when request body is null', async () => {
        try {
            await request.post(`${process.env.SERVER_URL}/api/reviews/create`, {
                json: true,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/json'
                },
            });
        } catch (error) {
            const response = {
                status: 'error',
                message: 'You\'ve requested to create a new review but the request body seems to be empty. Kindly pass the review to be created using request body in application/json format',
                reasonPhrase: 'EmptyRequestBodyError'
            };
            expect(error.statusCode).to.equal(400);
            expect(error.error).to.eql(response);
        }
    });

    it('should create document when all validation passes', async () => {

        const review = await request.post(`${process.env.SERVER_URL}/api/reviews/create`, {
            body: sampleReview,
            json: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
        });
        sampleReview._id = review._id;
        expect(review).not.to.be.null;
    });

    after(async () => {
        const collection = await getMongodbCollection('users');
        await collection.deleteOne({ _id: sampleUser._id });
        const collectionProduct = await getMongodbCollection('products');
        await collectionProduct.deleteOne({ _id: sampleProduct._id });
        const collectionReview = await getMongodbCollection('reviews');
        await collectionReview.deleteOne({ _id: sampleReview._id });
    });
});