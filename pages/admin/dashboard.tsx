import axios from 'axios';
import Link from 'next/link';
import { useEffect, useReducer } from 'react';
import Layout from '../../components/Layout';
import getError from '../../utils/error';
import { Bar } from 'react-chartjs-2';
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
  Title,
} from 'chart.js';

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Legend,
  Tooltip,
  Title
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

const reducer = (state, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, summery: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Dashboard = () => {
  const [{ loading, error, summery }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    summery: { salesData: [] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/summery');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, []);

  const data = {
    labels: summery.salesData.map((x: any) => x._id),
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(162,222,208,1)',
        data: summery.salesData.map((x: any) => x.totalSales),
      },
    ],
  };
  return (
    <Layout title="Admin Dashboard">
      <div className="grid md:grid-cols-4 md:gap-5">
        <div>
          <ul>
            <li>
              <Link href="/admin/dashboard" className="font-bold">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/admin/orders">Orders</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users">Users</Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Dashboard</h1>
          {loading ? (
            <div>loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="card p-5 m-5">
                  <p className="text-3xl">${summery.ordersPrice}</p>
                  <p>Sales</p>
                  <Link href="/admin/orders">View sales</Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-3xl">{summery.ordersCount}</p>
                  <p>Orders</p>
                  <Link href="/admin/orders">View sales</Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-3xl">{summery.productsCount}</p>
                  <p>Products</p>
                  <Link href="/admin/products">View products</Link>
                </div>
                <div className="card p-5 m-5">
                  <p className="text-3xl">{summery.usersCount}</p>
                  <p>Users</p>
                  <Link href="/admin/users">View users</Link>
                </div>
              </div>
              <h2 className="text-xl">Sales Report</h2>
              <Bar
                options={{ legend: { display: true, position: 'right' } }}
                data={data}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

Dashboard.authed = { adminOnly: true };
export default Dashboard;
