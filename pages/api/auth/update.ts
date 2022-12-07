import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import bcryptjs from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(400).send({ message: `${req.method} not supported` });
  }
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: 'sign in is required' });
  }
  const { user } = session;
  const { name, email, password } = req.body;
  if (
    !email ||
    !name ||
    !email.includes('@') ||
    (password && password.trim().length < 8)
  ) {
    res.status(422).json({ message: 'Validation error' });
    return;
  }

  db.connect();
  const userDB = await User.findById(user._id);
  userDB.email = email;
  userDB.name = name;
  if (password) {
    userDB.password = bcryptjs.hashSync(password);
  }

  await userDB.save();

  db.disconnect();

  res.send({
    message: 'user updated',
  });
};

export default handler;
