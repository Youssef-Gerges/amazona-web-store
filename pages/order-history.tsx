import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../components/Layout';
import getError from '../utils/error';

function reducer(
  state: { loading: boolean; error: string; orders: [] },
  action: { type: string; payload?: any }
) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderHistory = () => {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    orders: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders/history');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };

    fetchOrders();
  }, []);
  return (
    <Layout title="order history">
      <h1 className="mb-4 text-xl">Order Histor</h1>
      {loading ? (
        <div>Loading....</div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="px-5 text-left">ID</th>
              <th className="px-5 text-left">DATE</th>
              <th className="px-5 text-left">TOTAL</th>
              <th className="px-5 text-left">PAID</th>
              <th className="px-5 text-left">DELIVERED</th>
              <th className="px-5 text-left">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-b" key={order._id}>
                <td className="p-5">{order._id.substring(20, 24)}</td>
                <td className="p-5">{order.createdAt.substring(0, 10)}</td>
                <td className="p-5">{order.totalPrice}</td>
                <td className="p-5">
                  {order.isPaid
                    ? `${order.paidAt.substring(0, 10)}`
                    : 'not paid'}
                </td>
                <td className="p-5">
                  {order.isDelivered
                    ? `${order.deliveredAt.substring(0, 10)}`
                    : 'not delivered'}
                </td>
                <td className="p-5">
                  <Link href={`order/${order._id}`}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};
OrderHistory.authed = true;
export default OrderHistory;
