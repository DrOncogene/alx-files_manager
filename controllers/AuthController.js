import sha1 from 'sha1';
import { v4 as uuidV4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const getConnect = async (req, res) => {
  const authHeaderEncoded = req.headers.authorization.split(' ')[1];
  const authHeader = Buffer.from(authHeaderEncoded, 'base64').toString('ascii');
  const email = authHeader.split(':')[0];
  const password = authHeader.split(':')[1];

  const user = await dbClient.getUser({ email, password: sha1(password) });
  if (!user) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const token = uuidV4();
  redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

  res.status(200).send({ token });
};

const getDisconnect = async (req, res) => {
  const authToken = req.headers['x-token'];

  const userId = await redisClient.get(`auth_${authToken}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  redisClient.del(`auth_${authToken}`);
  res.status(204).send();
};

const getMe = async (req, res) => {
  const authToken = req.headers['x-token'];

  const userId = await redisClient.get(`auth_${authToken}`);
  if (!userId) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const user = await dbClient.getUser({ _id: ObjectId(userId) });
  res.send({
    id: user._id,
    email: user.email,
  });
};

export {
  getConnect,
  getDisconnect,
  getMe,
};
