import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', async (err) => {
      console.log(err);
      await this.client.disconnect();
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
