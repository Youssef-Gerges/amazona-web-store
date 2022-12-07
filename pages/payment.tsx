/* eslint-disable react-hooks/rules-of-hooks */
import { useRouter } from 'next/router';
import React, { FormEvent, useContext, useEffect, useState } from 'react';
import CheckoutWizard from '../components/CheckoutWizard';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const payment: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      router.push('/shipping');
    }

    setSelectedPaymentMethod(paymentMethod || '');
  }, [shippingAddress, router, paymentMethod]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error('Payment method is required');
    }
    dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: selectedPaymentMethod });
    Cookies.set(
      'cart',
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push('/placeorder');
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form className="mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl">Payment Method</h1>
        {['Paypal', 'Cash on delivery'].map((method, index) => (
          <div className="mb-4" key={index}>
            <input
              type="radio"
              className="p-2 outline-none focus:ring-0"
              checked={selectedPaymentMethod === method}
              onChange={() => setSelectedPaymentMethod(method)}
              id={method}
            />
            <label htmlFor={method} className="p-2">
              {method}
            </label>
          </div>
        ))}
        <div className="mb-4 flex justify-between">
          <button
            className="default-button"
            onClick={() => router.push('/shipping')}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

payment.authed = true;
export default payment;
