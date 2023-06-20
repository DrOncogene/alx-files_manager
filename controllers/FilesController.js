import fs from 'fs';
import path from 'path';
import { v4 as uuidV4 } from 'uuid';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const postUpload = async (req, res) => {
  const authToken = req.headers['x-token'];

  const userId = await redisClient.get(`auth_${authToken}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const user = await dbClient.getUser({ _id: ObjectId(userId) });
  if (!user) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { name, type, data } = req.body;
  const parentId = req.body.parentId || 0;
  const isPublic = req.body.isPublic || false;

  if (!name) {
    res.status(400).send({ error: 'Missing name' });
    return;
  }
  if (!type || !['folder', 'file', 'image'].includes(type)) {
    res.status(400).send({ error: 'Missing type' });
    return;
  }
  if (!data && type !== 'folder') {
    res.status(400).send({ error: 'Missing data' });
    return;
  }

  if (parentId) {
    const parent = await dbClient.getFile(parentId);
    if (!parent) {
      res.status(400).send({ error: 'Parent not found' });
      return;
    } if (parent.type !== 'folder') {
      res.status(400).send({ error: 'Parent is not a folder' });
      return;
    }
  }

  let file;
  if (type === 'folder') {
    file = await dbClient.addFile({
      userId: user._id.toString(),
      name,
      type,
      parentId,
      isPublic,
      data,
    });
  } else {
    const filesDir = path.join(process.env.FOLDER_PATH || '/tmp/files_manager');
    const filePath = `${filesDir}/${uuidV4()}`;
    await fs.mkdir(filesDir, { recursive: true }, (err) => console.log(err));
    await fs.writeFile(filePath, Buffer.from(data, 'base64').toString('utf-8'), (err) => {
      if (err) {
        console.log(err);
      }
    });

    file = await dbClient.addFile({
      userId: user._id.toString(),
      name,
      type,
      parentId,
      isPublic,
      data,
      localPath: `${filePath}`,
    });
  }

  res.status(201).send(file);
};

const getShow = async (req, res) => {
  const authToken = req.headers['x-token'];

  const userId = await redisClient.get(`auth_${authToken}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const user = await dbClient.getUser({ _id: ObjectId(userId) });
  if (!user) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.params;
  const file = dbClient.getFile(id);
  if (!file) {
    res.status(404).send({ error: 'Not found' });
    return;
  }

  res.send(file);
};

const getIndex = async (req, res) => {
  const authToken = req.headers['x-token'];
  let { parentId, page } = req.params;

  const userId = await redisClient.get(`auth_${authToken}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const user = await dbClient.getUser({ _id: ObjectId(userId) });
  if (!user) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const parent = await dbClient.getFile(parentId);
  console.log(parent);
  if (!parent) {
    parentId = 0;
  }
  if (!page) {
    page = 0;
  }

  const files = await dbClient.getUserFiles(userId, parentId, page);
  const userFiles = [];

  await files.forEach((file) => {
    userFiles.push(file);
  });

  res.send(userFiles);
};

export {
  postUpload,
  getShow,
  getIndex,
};
