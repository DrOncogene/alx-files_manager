import { MongoClient } from 'mongodb';
import process from 'process';

class DBClient {
  constructor() {
    const HOST = process.env.DB_HOST || 'localhost';
    const PORT = process.env.DB_PORT || 27017;
    const DB_NAME = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${HOST}:${PORT}/${DB_NAME}`;

    this.CLIENT = new MongoClient(url, { useUnifiedTopology: true });
    this.CLIENT.connect();
  }

  isAlive() {
    if (this.CLIENT) {
      return this.CLIENT.isConnected();
    }
    return false;
  }

  async nbUsers() {
    if (!this.CLIENT) {
      return 0;
    }
    const users = this.CLIENT.db().collection('users');
    return users.countDocuments();
  }

  async nbFiles() {
    if (!this.CLIENT) {
      return 0;
    }
    const files = this.CLIENT.db().collection('files');
    return files.countDocuments();
  }

  async addUser(user) {
    const res = await this.CLIENT.db().collection('users').insertOne(user);
    if (res.result.ok) {
      return res.insertedId;
    }
    return null;
  }

  async getUser(queryObj) {
    return this.CLIENT.db().collection('users').findOne(queryObj);
  }
}

const dbClient = new DBClient();

export default dbClient;
