import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Product from '../../../../../models/Product';
import db from '../../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'PUT') {
    return putHandler(req, res);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const getHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id).lean();
  await db.disconnect();
  return res.send(db.convertDocToObj(product));
};

const putHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    const form = new formidable.IncomingForm();
    form.keepExtemsions = true;
    form.parse(req, async (err, fields, files) => {
      product.name = fields.name;
      product.price = fields.price;
      product.image = fields.image;
      product.category = fields.category;
      product.slug = fields.slug;
      product.brand = fields.brand;
      product.countInStock = fields.countInStock;
      product.description = fields.description;
      if (files.imageFile) {
        await saveFile(files.imageFile, fields.image);
      }
      await product.save();
    });
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const product = await Product.findById(req.query.id);
  if (product) {
    await fs.unlinkSync(`./public${product.image}`);
    product.remove();
    await db.disconnect();
    res.send({ message: 'Product updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Product not found' });
  }
};

const saveFile = async (file, name) => {
  const data = fs.readFileSync(file.filepath);
  fs.writeFileSync(`./public${name}`, data);
  await fs.unlinkSync(file.filepath);
  return;
};
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
