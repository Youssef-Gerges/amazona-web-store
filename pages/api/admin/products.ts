import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }

  if (req.method === 'GET') {
    return getHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const orders = await Product.find({});
  await db.disconnect();
  return res.send(orders);
};

export default handler;
