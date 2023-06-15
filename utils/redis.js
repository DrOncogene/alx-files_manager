import redis from 'redis';
import { promisify } from 'util'

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
    const asyncGet = promisify(this.client.get).bind(this.client);
    return await asyncGet(key);
  }
  
  async set (key, value, ttl) {
    const asyncSetex = promisify(this.client.setex).bind(this.client);
    await asyncSetex(key, ttl, value.toString());
  }
  
  async del (key) {
    const asyncDel = promisify(this.client.del).bind(this.client.del);
    await asyncDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
