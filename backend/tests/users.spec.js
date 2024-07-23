'use strict';

const expect = require('chai').expect;
const request = require('request-promise');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { getMongodbCollection } = require('../config/dbConfig');

const sampleUser = {
    "_id": new ObjectId(),
    "username": "JohnDoe",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@gmail.com",
    "password": "$2b$10$HBU32JOg0AmSurTSMAlsauxN.48lLdtR/BdLPRfckyskJNEmnpKTK",
    "role": "user",
}

describe('Get all Users', () => {
    const accessToken = jwt.sign({ _id: sampleUser._id }, process.env.AUTH_TOKEN_SECRET, { expiresIn: '1d' });
    before(async () => {
        const collection = await getMongodbCollection('users');
        await collection.insertOne(sampleUser);
    });

    it('should return the document when all validation passes', async () => {
        const response = await request.get(`${process.env.SERVER_URL}/api/users`, {
            json: true,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            },
        });

        // Check if the response object has the expected structure with users as an array
        expect(response).to.be.an('object').that.includes.keys('totalCount', 'users', 'filteredCount');
        expect(response.users).to.be.an('array');
        // Here you should conditionally run the following based on  whether you expect the array to be empty or not:
        // If you expect at least one user in the response (including sampleUser):
        expect(response.users.length).to.be.greaterThan(0);

        // Then check if sampleUser exists in the users array
        const exists = response.users.some(user => new ObjectId(user._id).equals(new ObjectId(sampleUser._id)));
        expect(exists).to.be.true;

        // Add a check to ensure there are no duplicate emails
        const emails = response.users.map(user => user.email);
        const uniqueEmails = new Set(emails);
        expect(uniqueEmails.size).to.equal(emails.length);
    });

    after(async () => {
        const collection = await getMongodbCollection('users');
        await collection.deleteOne({ _id: sampleUser._id });

    });
});