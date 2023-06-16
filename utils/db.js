import { MongoClient } from 'mongodb';
import process from 'process';

class DBClient {
  HOST = process.env.DB_HOST || 'localhost';

  PORT = parseInt(process.env.DB_PORT, 10) || 27017;

  DB_NAME = process.env.DB_DATABASE || 'files_manager';

  CLIENT;

  DB;

  constructor() {
    MongoClient.connect(`mongodb://${this.HOST}:${this.PORT}`, { useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log(err);
        return;
      }
      this.CLIENT = client;
      this.DB = client.db(this.DB_NAME);
    });
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
    const users = this.DB.collection('users');
    return users.countDocuments({});
  }

  async nbFiles() {
    if (!this.CLIENT) {
      return 0;
    }
    const files = this.DB.collection('files');
    return files.countDocuments({});
  }
}

const dbClient = new DBClient();

export default dbClient;
