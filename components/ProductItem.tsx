/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import ProductInterface from '../interfaces/product.interface';
import { Store } from '../utils/Store';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductItem: React.FC<ProductInterface> = (product) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);

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
    // router.push('/cart');
    toast.success('Product added to cart successfully');
  };

  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow justify-stretch"
          width={'100%'}
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button
          className="primary-button"
          type="button"
          onClick={addToCartHandler}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
