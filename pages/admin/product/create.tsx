import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../../../components/Layout';
import getError from '../../../utils/error';

const reducer = (state, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'SAVE_REQUEST':
      return { ...state, loadingSave: true };
    case 'SAVE_SUCCESS':
      return { ...state, loadingSave: false };
    case 'SAVE_FAIL':
      return { ...state, loadingSave: false, error: action.payload };
    default:
      return state;
  }
};

const CreateProduct: React.FC = () => {
  const [imageFile, setImageFile] = useState();

  const router = useRouter();
  const [{ error, loadingSave }, dispatch] = useReducer(reducer, {
    error: '',
    loadingSave: false,
  });
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({
    name,
    slug,
    price,
    category,
    brand,
    countInStock,
    description,
  }) => {
    if (!imageFile) {
      return toast.error('Please add product image');
    }
    try {
      dispatch({ type: 'SAVE_REQUEST' });
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('countInStock', countInStock);
      formData.append('description', description);
      formData.append('imageFile', imageFile);

      await axios.post(`/api/admin/products/create`, formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
      });

      dispatch({ type: 'SAVE_SUCCESS' });
      toast.success('Product saved successfully');
      router.push(`/product/${getValues('slug')}`);
    } catch (error) {
      dispatch({ type: 'SAVE_FAIL', payload: getError(error) });
    }
  };

  const uploadToLocal = (event) => {
    if (event.target.files[0]) {
      const i = event.target.files[0];
      setImageFile(i);
    }
  };

  return (
    <Layout title="Edit Product">
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

        <div className="md:col-span-3">
          {error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <form
              className="max-w-full-md mx-auto"
              onSubmit={handleSubmit(submitHandler)}
            >
              <h1 className="mb-4 text-xl">Create Product</h1>
              <div className="mb-4">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="w-full"
                  id="name"
                  autoFocus
                  {...register('name', {
                    required: 'Please enter product name',
                  })}
                />
                {errors.name && (
                  <div className="text-red-500">{errors.name.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="slug">Slug</label>
                <input
                  type="text"
                  className="w-full"
                  id="slug"
                  {...register('slug', {
                    required: 'Please enter product slug',
                    pattern: {
                      value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/i,
                      message: 'slug can not include spaces',
                    },
                  })}
                />
                {errors.slug && (
                  <div className="text-red-500">{errors.slug.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="price">Price</label>
                <input
                  type="text"
                  className="w-full"
                  id="price"
                  {...register('price', {
                    required: 'Please enter product price',
                  })}
                />
                {errors.price && (
                  <div className="text-red-500">{errors.price.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  className="w-full"
                  id="category"
                  {...register('category', {
                    required: 'Please enter product category',
                  })}
                />
                {errors.category && (
                  <div className="text-red-500">{errors.category.message}</div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  className="w-full"
                  id="brand"
                  {...register('brand', {
                    required: 'Please enter product brand',
                  })}
                />
                {errors.brand && (
                  <div className="text-red-500">{errors.brand.message}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="uploadImage">Upload Image</label>
                <input
                  type="file"
                  className="w-full"
                  id="uploadImage"
                  onChange={uploadToLocal}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="countInStock">Count in stock</label>
                <input
                  type="text"
                  className="w-full"
                  id="countInStock"
                  {...register('countInStock', {
                    required: 'Please enter product count in stock',
                  })}
                />
                {errors.countInStock && (
                  <div className="text-red-500">
                    {errors.countInStock.message}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="w-full"
                  id="description"
                  {...register('description', {
                    required: 'Please enter product description',
                  })}
                />
                {errors.description && (
                  <div className="text-red-500">
                    {errors.description.message}
                  </div>
                )}
                <div className="mt-4">
                  <button className="primary-button" disabled={loadingSave}>
                    {loadingSave ? 'Loading' : 'Save'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

CreateProduct.authed = { adminOnly: true };
export default CreateProduct;
