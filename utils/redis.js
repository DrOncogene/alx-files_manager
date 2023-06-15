import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', async (err) => {
      console.log(err);
      await this.client.quit();
    });
  }

  isAlive () {
    return this.client.connected;
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

export default redisClient;
