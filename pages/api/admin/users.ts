import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }

  if (req.method === 'GET') {
    await db.connect();
    const users = await User.find({});
    await db.disconnect();
    return res.send(users);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

export default handler;
