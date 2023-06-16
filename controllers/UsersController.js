import sha1 from 'sha1';
import dbClient from '../utils/db';

const postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    res.status(400).send({ error: 'Missing email' });
    return;
  }
  if (!password) {
    res.status(400).send({ error: 'Missing password' });
    return;
  }

  const user = await dbClient.getUser({ email });
  if (user) {
    res.status(400).send({ error: 'Already exist' });
    return;
  }

  const id = await dbClient.addUser({
    email,
    password: sha1(password),
  });

  if (!id) {
    res.status(500).send({ error: 'Error creating new user' });
  }

  res.status(201).send({
    id,
    email,
  });
};

export default postNew;
