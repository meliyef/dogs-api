const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });
    describe('POST /dogs', () => {
        it('should POST a dog to DB', async () => {
            const response = await request(app)
            .post('/dogs')
            .send(testDogData)
            .set('Content-Type', 'application/json') 
            .expect(200);
    
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(expect.objectContaining(testDogData));
        });
        it('should delete a dog', async () => {
            // First, create a dog to get a valid ID
            const postResponse = await request(app)
                .post('/dogs')
                .send(testDogData)
                .set('Content-Type', 'application/json')
                .expect(200);
        
            const dogId = postResponse.body.id;
        
            // Now, delete the dog using the retrieved ID
            const deleteResponse = await request(app)
                .delete(`/dogs/${dogId}`)
                .set('Content-Type', 'application/json')
                .expect(200);
        
            // Assert that the response confirms the deletion
            expect(deleteResponse.body).toBeDefined();
        });

       })
})