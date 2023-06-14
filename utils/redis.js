import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient()
      .on('error', (err) => {
        console.log(`Unable to connect to redis: ${err}`);
      });
  }

  isAlive () {
    return this.client.isReady;
  }
  
  async get (key) {
    return await this.client.get(key);
  }
  
  async set (key, value, ttl) {
    await this.client.setEx(key, ttl, value.toString());
  }
  
  async del (key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
await redisClient.client.connect();

export default redisClient;
