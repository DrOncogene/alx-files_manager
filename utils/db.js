import { MongoClient } from 'mongodb';
import process from 'process'

class DBClient {
  HOST = process.env.DB_HOST || 'localhost';
  PORT = parseInt(process.env.DB_PORT) || 27017;
  DB = process.env.DB_DATABASE || 'files_manager';

  constructor() {
    MongoClient.connect(`mongodb://${this.HOST}:${this.PORT}`, {
      useUnifiedTopology: true
    })
    .then((client) => this.client = client)
    .catch(err => {
      console.log(err);
      this.client.close();
    });
  }

  isAlive() {
    if (this.client) {
      return this.client.isConnected();
    } else {
      return false;
    }
  }

  async nbUsers() {
    if (!this.client) {
      return 0;
    }
    const users = this.db.collection('users');
    return await users.countDocuments({});
  }

  async nbFiles() {
    if (!this.client) {
      return 0;
    }
    const files = this.db.collection('files');
    return await files.countDocuments({});
  }
}

const dbClient = new DBClient();

export default dbClient;
