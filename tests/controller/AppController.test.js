const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const AppController = require('./appController');
const RedisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const { expect } = chai;

chai.use(chaiHttp);

describe('AppController', () => {
  describe('getStatus', () => {
    it('should return status with redis and db information', async () => {
      // Mock the RedisClient and DBClient methods
      sinon.stub(RedisClient, 'isAlive').returns(true);
      sinon.stub(dbClient, 'isAlive').returns(true);

      const request = {};
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(200);
          return {
            send: (status) => {
              expect(status).to.deep.equal({
                redis: true,
                db: true,
              });
            },
          };
        },
      };

      await AppController.getStatus(request, response);

      // Restore the original methods
      RedisClient.isAlive.restore();
      dbClient.isAlive.restore();
    });
  });

  describe('getStats', () => {
    it('should return statistics for users and files', async () => {
      // Mock the DBClient methods
      sinon.stub(dbClient, 'nbUsers').returns(42);
      sinon.stub(dbClient, 'nbFiles').returns(100);

      const request = {};
      const response = {
        status: (statusCode) => {
          expect(statusCode).to.equal(200);
          return {
            send: (stats) => {
              expect(stats).to.deep.equal({
                users: 42,
                files: 100,
              });
            },
          };
        },
      };

      await AppController.getStats(request, response);

      // Restore the original methods
      dbClient.nbUsers.restore();
      dbClient.nbFiles.restore();
    });
  });
});
