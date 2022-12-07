import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import getError from '../../utils/error';

function reducer(
  state: { loading: boolean; error: string; order: {} },
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderInfo = () => {
  const { query } = useRouter();
  const orderId = query.id;
  const router = useRouter();
  const { data: session } = useSession();
  const { user } = session;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {},
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [orderId, order]);
  const onApprove = async (data, actions) => {
    return actions.order
      .capture()
      .then(async function (info) {
        const { payer } = info;
        await axios.post('/api/orders/pay', {
          payer,
          orderId,
        });
        toast.success('Order paid successfully');
        router.reload();
      })
      .catch((err) => toast.error('Something went wrong.'));
  };

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              // charge users $499 per order
              value: order.totalPrice,
            },
          },
        ],
        // remove the applicaiton_context object if you need your users to add a shipping address
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        return orderID;
      });
  };

  const deliverOrder = async () => {
    try {
      await axios.post('/api/orders/deliver', {
        orderId,
      });
      toast.success('Order delivered successfully');
      router.reload();
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Order Info">
      <h1 className="mb-4 text-xl">Order Number: {order._id}</h1>
      {loading ? (
        <div>Loading....</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3">
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Shipping Address</h2>
              <div>
                {order.shippingAddress.fullName},{' '}
                {order.shippingAddress.streetAddress},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                , {order.shippingAddress.country}
              </div>
              {order.isDelivered ? (
                <div className="alert-success">
                  Delivered at {order.deliveredAt}
                </div>
              ) : (
                <div className="alert-error">Not delivered</div>
              )}
            </div>
            <div className="card p-5">
              <h2 className="mb-2 text-lg">Payment Method</h2>
              <div>{order.paymentMethod}</div>
              {order.isPaid ? (
                <div className="alert-success">Paid at {order.paidAt}</div>
              ) : (
                <div className="alert-error">Not paid</div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="mb-2 text-lg">Order Items</h2>
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">Item</th>
                    <th className="px-5 text-right">Quantity</th>
                    <th className="px-5 text-right">Price</th>
                    <th className="px-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map((item: any) => (
                    <tr key={item.name} className="border-b">
                      <td className="flex items-center">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />
                        &nbsp;{item.name}
                      </td>
                      <td className="p-5 text-right">{item.quantity}</td>
                      <td className="p-5 text-right">${item.price}</td>
                      <td className="p-5 text-right">
                        ${item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card p-5">
            <h2 className="mb-2 text-lg">Order Summery</h2>
            <ul>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Items</div>
                  <div>${order.itemsPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Tax</div>
                  <div>${order.taxPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Shipping</div>
                  <div>${order.shippingPrice}</div>
                </div>
              </li>
              <li>
                <div className="mb-2 flex justify-between">
                  <div>Total Price</div>
                  <div>${order.totalPrice}</div>
                </div>
              </li>
              {!order.isPaid &&
              order.paymentMethod.toLowerCase() === 'paypal' ? (
                <li>
                  <div className="mt-2">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </div>
                </li>
              ) : (
                user.isAdmin &&
                !order.isDelivered && (
                  <li>
                    <div className="mt-2">
                      <button
                        className="primary-button min-w-full"
                        onClick={deliverOrder}
                      >
                        Deliver Order
                      </button>
                    </div>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

OrderInfo.authed = true;
export default OrderInfo;
