import { Request, Response } from 'express';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
    static async getStatus(request, response) {
        const status = {
            redis: redisClient.isAlive(),
            db: dbClient.isAlive()
        };
        return response.status(200).send(status);
    }

    static async getStats(request, response) {
        const stats = {
            users: await dbClient.nbUsers(),
            files: await dbClient.nbFiles()
        };
        return response.status(200).send(stats);
    }
}

module.exports = AppController;
