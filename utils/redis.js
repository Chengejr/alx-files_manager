// utils/redis.js  
import { createClient } from 'redis';  

class RedisClient {  
    constructor() {  
        this.client = createClient();  

        this.client.on('error', (err) => {  
            console.error('Redis Client Error', err);  
        });  

        this.client.connect().catch(console.error);  
    }  

    async isAlive() {  
        try {  
            await this.client.ping();  
            return true;  
        } catch (error) {  
            return false;  
        }  
    }  

    async get(key) {  
        try {  
            const value = await this.client.get(key);  
            return value;  
        } catch (error) {  
            console.error('Error getting value from Redis:', error);  
            return null;  
        }  
    }  

    async set(key, value, duration) {  
        try {  
            await this.client.set(key, value, 'EX', duration);  
        } catch (error) {  
            console.error('Error setting value in Redis:', error);  
        }  
    }  

    async del(key) {  
        try {  
            await this.client.del(key);  
        } catch (error) {  
            console.error('Error deleting value from Redis:', error);  
        }  
    }  
}  

// Create and export an instance of RedisClient  
const redisClient = new RedisClient();  
export default redisClient;
