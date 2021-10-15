const express = require('express'); // import express
const request = require('supertest');
const serverRoutes = require('./routes/index');
// import file we are testing
const myCredentials = { client_id: 'dare', client_secret: 's3cr3t' };

// supertest is a framework that allows to easily test web apis
const app = express(); // an instance of an express app, a 'fake' express app
app.use('/', serverRoutes); // routes
describe('testing-API-routes', () => {
  it('POST /api/login', async () => {
    const { body } = await request(app).post('/api/login', myCredentials);
    expect(body).toHaveProperty('type');
    expect(body).toHaveProperty('token');
  });
  it('GET /api/clients', async () => {
    const { body } = await request(app).get('/api/clients'); // uses the request function that calls on express app instance
    body.forEach((item) => {
      expect(item).toHaveProperty('email');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('role');
    });
  });
  it('GET /api/policies', async () => {
    const { body } = await request(app).get('/api/policies'); // uses the request function that calls on express app instance
    body.forEach((item) => {
      expect(item).toHaveProperty('amountInsured');
      expect(item).toHaveProperty('clientId');
      expect(item).toHaveProperty('email');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('inceptionDate');
      expect(item).toHaveProperty('installmentPayment');
    });
  });
});

describe('testing-own-routes', () => {
  it('POST /login', async () => {
    const { body } = await request(app).post('/login', {
      username: 'britneyblankenship@quotezart.com',
      password: 'undefined',
    });
    expect(body).toBe(undefined)
  });
  it('GET /clients', async () => {
    const { body } = await request(app).get('/clients'); // uses the request function that calls on express app instance
    body.forEach((item) => {
      expect(item).toHaveProperty('email');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('role');
      expect(item).toHaveProperty('policies');
      if (item.policies.length > 0) {
        item.policies.forEach((policy) => {
          expect(policy).toHaveProperty('id');
          expect(policy).toHaveProperty('amountInsured');
          expect(policy).toHaveProperty('inceptionDate');
        });
      }
    });
  });
  it('GET /policies', async () => {
    const { body } = await request(app).get('/policies'); // uses the request function that calls on express app instance
    body.forEach((item) => {
      expect(item).toHaveProperty('amountInsured');
      expect(item).toHaveProperty('email');
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('inceptionDate');
      expect(item).toHaveProperty('installmentPayment');
    });
  });
});
