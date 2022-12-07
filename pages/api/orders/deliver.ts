import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import db from '../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'POST') {
    if (req.body.orderId) {
      await db.connect();
      const order = await Order.findById(req.body.orderId);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date().toISOString();
        order.save();
        await db.disconnect();
        res.send('delivered successfully');
      } else {
        await db.disconnect();
        res.status(404).send({ message: 'not found' });
      }
    }
  }
};

export default handler;
