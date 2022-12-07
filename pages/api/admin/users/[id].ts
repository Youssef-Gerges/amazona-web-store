import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import User from '../../../../models/User';
import db from '../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  await db.connect();
  const user = await User.findById(id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send('user deleted successfully');
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'not found' });
  }
};

export default handler;
