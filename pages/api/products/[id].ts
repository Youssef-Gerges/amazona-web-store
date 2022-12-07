/* eslint-disable no-unused-vars */
import Product from '../../../models/Product';
import db from '../../../utils/db';

const handler = async (
  req: { query: { id: any } },
  res: { send: (arg0: any) => void }
) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  await db.disconnect();
  res.send(product);
};

export default handler;
