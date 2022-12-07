import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';

export default function Home({ products }) {
  return (
    <Layout title="Home">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem {...product} key={product.slug} />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
