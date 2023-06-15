import { MongoClient } from 'mongodb';
import process from 'process'

class DBClient {
  HOST = process.env.DB_HOST || 'localhost';
  PORT = parseInt(process.env.DB_PORT) || 27017;
  DB = process.env.DB_DATABASE || 'files_manager';

  constructor() {
    this.client = new MongoClient(`mongodb://${this.HOST}:${this.PORT}`, {
      useUnifiedTopology: true
    });
    this.client.connect()
      .then((client) => {
        this.db = this.client.db(this.DB);
      })
      .catch(err => console.log(err));
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
