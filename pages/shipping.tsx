/* eslint-disable react-hooks/rules-of-hooks */
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import useAuthed from '../utils/useAuthed';

const shipping: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();

  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  const { cart } = state;
  const { shippingAddress } = cart;

  useEffect(() => {
    if (shippingAddress) {
      setValue('fullName', shippingAddress.fullName);
      setValue('streetAddress', shippingAddress.streetAddress);
      setValue('postalCode', shippingAddress.postalCode);
      setValue('city', shippingAddress.city);
      setValue('country', shippingAddress.country);
    }
  }, [shippingAddress, setValue]);

  const submitHandler = ({
    fullName,
    streetAddress,
    postalCode,
    city,
    country,
  }: {
    fullName: string;
    streetAddress: string;
    postalCode: string;
    city: string;
    country: string;
  }) => {
    dispatch({
      type: 'SAVE_SHIPPING_ADDRESS',
      payload: { fullName, streetAddress, postalCode, city, country },
    });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          streetAddress,
          postalCode,
          city,
          country,
        },
      })
    );
    router.push('/payment');
  };
  return (
    <Layout title="Shipping">
      <CheckoutWizard activeStep={1} />
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Shipping Address</h1>
        <div className="mb-4">
          <label htmlFor="full_name">Full name</label>
          <input
            type="text"
            id="full_name"
            className="w-full"
            autoFocus
            {...register('fullName', {
              required: 'Please enter full name',
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.fullName.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="streetAddress">Street address</label>
          <input
            type="text"
            id="streetAddress"
            className="w-full"
            {...register('streetAddress', {
              required: 'Please enter street address',
              minLength: {
                value: 3,
                message: 'Street address is more than 3 chars',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.streetAddress.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            className="w-full"
            {...register('city', {
              required: 'Please enter city',
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.city.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            className="w-full"
            {...register('postalCode', {
              required: 'Please enter postal Code',
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.postalCode.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="country">country</label>
          <input
            type="text"
            id="country"
            className="w-full"
            {...register('country', {
              required: 'Please enter country',
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-4 flex justify-between">
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

shipping.authed = true;
export default shipping;
