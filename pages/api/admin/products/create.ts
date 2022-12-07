import formidable from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user?.isAdmin)) {
    return res.status(401).send('signin required');
  }
  if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};

const postHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  await db.connect();
  const newProduct = new Product();
  const form = new formidable.IncomingForm();
  form.keepExtemsions = true;

  form.parse(req, async (err, fields, files) => {
    newProduct.name = fields.name;
    newProduct.price = fields.price;
    newProduct.category = fields.category;
    newProduct.slug = fields.slug;
    newProduct.image = fields.slug;
    newProduct.brand = fields.brand;
    newProduct.countInStock = fields.countInStock;
    newProduct.description = fields.description;
    const product = await newProduct.save();
    const imageName = `/images/${product._id}.jpeg`;
    await saveFile(files.imageFile, imageName);
    product.image = imageName;
    product.save();
  });
  await db.disconnect();
  res.send('Product saved successfully');
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
