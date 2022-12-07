import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import Product from '../../models/Product';
import data from '../../utils/data';
import db from '../../utils/db';
import { Store } from '../../utils/Store';

const ProductScreen: React.FC = ({ product }) => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  // const { slug } = router.query;
  // const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <div>Product not Found</div>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error('Sorry Product is out of stock');
      return;
    }
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity: quantity },
    });
    router.push('/cart');
  };
  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">Back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-2">
        <div className="md:col-span-1">
          <Image
            src={product.image}
            alt={product.name}
            width={300}
            height={300}
            responsive={true}
          />
        </div>
        <div className="md:col-span-2">
          <ul>
            <li>
              <h1 className="text-2xl font-bold">{product.name}</h1>
            </li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>

        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? 'In Stock' : 'Unavailable'}</div>
            </div>
            <button
              className="primary-button w-full"
              onClick={addToCartHandler}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductScreen;

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  await db.connect();
  const product = await Product.find({ slug }).lean();
  await db.disconnect();
  // console.log(JSON.stringify(db.convertDocToObj(product)));
  return {
    props: {
      product: product ? db.convertDocToObj(product[0]) : null,
    },
  };
}
