import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import getError from '../../utils/error';

const reducer = (state, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, products: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Products: React.FC = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    products: [],
  });
  const fetchData = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await axios.get('/api/admin/products');
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const deleteProduct = async (product) => {
    const msg = confirm('Do you sure! delete this product?');
    if (msg) {
      try {
        await axios.delete(`/api/admin/products/${product}`);
        toast.success('Product deleted successfully');
        fetchData();
      } catch (error) {
        toast.error(error);
      }
    }
  };
  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-4">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products" className="font-bold">
                Products
              </Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Products</h1>
          {loading ? (
            <div>loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Link
                href="/admin/product/create"
                className="text-black hover:text-black"
              >
                <button className="primary-button float-right">Create</button>
              </Link>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="px-5 text-left">NAME</th>
                    <th className="px-5 text-left">PRICE</th>
                    <th className="px-5 text-left">CATEGORY</th>
                    <th className="px-5 text-left">COUNT</th>
                    <th className="px-5 text-left">RATING</th>
                    <th className="px-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr className="border-b" key={product._id}>
                      <td className="p-5">{product._id.substring(20, 24)}</td>
                      <td className="p-5">{product.name}</td>
                      <td className="p-5">{product.price}</td>
                      <td className="p-5">{product.category}</td>
                      <td className="p-5">{product.countInStock}</td>
                      <td className="p-5">{product.ratings}</td>
                      <td className="p-5">
                        <Link href={`/admin/product/${product._id}`}>
                          <button className="default-button">Edit</button>
                        </Link>
                        <button
                          className="default-button ml-2"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

Products.authed = { adminOnly: true };
export default Products;
