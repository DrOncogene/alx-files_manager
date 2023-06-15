import { MongoClient } from 'mongodb';

class DBClient {
  HOST = process.env.DB_HOST || 'localhost';
  PORT = parseInt(process.env.DB_PORT) || 27017;
  DB = process.env.DB_DATABASE || 'files_manager';

  constructor() {
    this.client = new MongoClient(`mongodb://${this.HOST}:${this.PORT}`, {
      useUnifiedTopology: true
    });
    this.client.connect(() => {
      this.db = this.client.db(this.DB);
      console.log('CONNECTING...')
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    return await users.countDocuments({});
  }

  async nbFiles() {
    const files = this.db.collection('files');
    return await files.countDocuments({});
  }
}

const dbClient = new DBClient();

export default dbClient;
