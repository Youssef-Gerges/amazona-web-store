import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('singin required');
  }

  const { user } = session;
  await db.connect();
  // const userDB = await User.find({ email: user?.email }).lean();
  const newOrder = new Order({
    user: user._id,
    ...req.body,
  });
  const order = await newOrder.save();
  await db.disconnect();
  res.status(201).send(order);
};

export default handler;
