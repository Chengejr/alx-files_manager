const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sha1 = require('sha1');
const { ObjectId } = require('mongodb');
const UsersController = require('./usersController');
const dbClient = require('../utils/db');
const RedisClient = require('../utils/redis');

const { expect } = chai;

chai.use(chaiHttp);

describe('UsersController', () => {
  describe('postNew', () => {
    it('should create a new user and return user information', async () => {
      const request = {
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(201);
          return {
            send: (data) => {
              expect(data).to.have.property('id').to.be.a('string');
              expect(data).to.have.property('email').to.equal('test@example.com');
            },
          };
        },
      };

      // Mock DBClient methods
      sinon.stub(dbClient.db.collection('users'), 'findOne').resolves(null);
      sinon.stub(dbClient.db.collection('users'), 'insertOne').resolves({ insertedId: 'user_id' });

      await UsersController.postNew(request, response);

      // Restore the original methods
      dbClient.db.collection('users').findOne.restore();
      dbClient.db.collection('users').insertOne.restore();
    });

    it('should return an error if email already exists', async () => {
      const request = {
        body: {
          email: 'existing@example.com',
          password: 'password123',
        },
      };
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(400);
          return {
            send: (error) => {
              expect(error).to.have.property('error').to.equal('Already exist');
            },
          };
        },
      };

      // Mock DBClient methods
      sinon.stub(dbClient.db.collection('users'), 'findOne').resolves({ email: 'existing@example.com' });

      await UsersController.postNew(request, response);

      // Restore the original methods
      dbClient.db.collection('users').findOne.restore();
    });

    it('should return an error if email or password is missing', async () => {
      const request = {
        body: {},
      };
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(400);
          return {
            send: (error) => {
              expect(error).to.have.property('error');
            },
          };
        },
      };

      await UsersController.postNew(request, response);
    });
  });
