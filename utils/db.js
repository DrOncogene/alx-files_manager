import { MongoClient, ObjectId } from 'mongodb';
import process from 'process';

const MAX_PAGE_SIZE = 20;

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

  async getUser(userObj) {
    return this.CLIENT.db().collection('users').findOne(userObj);
  }

  async getFile(queryObj) {
    return this.CLIENT.db().collection('files').findOne(queryObj);
  }

  async getUserFiles(userId, parentId, page) {
    let matcher;
    if (parentId === 0) {
      matcher = { userId: ObjectId(userId), parentId: '0' };
    } else {
      matcher = { userId: ObjectId(userId), parentId: ObjectId(parentId) };
    }
    return this.CLIENT.db().collection('files').aggregate([
      { $match: matcher },
      { $skip: page === 0 ? 0 : page * MAX_PAGE_SIZE },
      { $limit: MAX_PAGE_SIZE },
      { $set: { id: '$_id' } },
      { $unset: '_id' },
    ]);
  }

  async addFile(fileObj) {
    const { data, ...datalessFile } = fileObj;
    const res = await this.CLIENT.db().collection('files').insertOne(fileObj);
    if (res.result.ok) {
      return {
        id: res.insertedId,
        userId: datalessFile.userId,
        name: datalessFile.name,
        type: datalessFile.type,
        parentId: datalessFile.parentId,
        isPublic: datalessFile.isPublic,
        data,
      };
    }
    return null;
  }
}

const dbClient = new DBClient();

export default dbClient;
