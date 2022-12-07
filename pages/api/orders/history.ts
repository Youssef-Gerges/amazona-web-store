import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import User from '../../../models/User';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send('sign in is required');
  }
  const { user } = session;
  await db.connect();
  // const userDB = await User.findOne({ email: user.email }).lean();
  const orders = await Order.find({
    user: user._id,
  });
  await db.disconnect();
  res.send(orders);
};

export default handler;
