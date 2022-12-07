/* eslint-disable no-unused-vars */
import Product from '../../models/Product';
import User from '../../models/User';
import data from '../../utils/data';
import db from '../../utils/db';

const handler = async (
  req: any,
  res: { send: (arg0: { message: string }) => void }
) => {
  await db.connect();
  await User.deleteMany();
  await User.insertMany(data.users);
  await Product.deleteMany();
  await Product.insertMany(data.products);
  await db.disconnect();
  res.send({ message: 'seed successfully' });
};

export default handler;
