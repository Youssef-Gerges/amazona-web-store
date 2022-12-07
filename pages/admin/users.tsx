import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import getError from '../../utils/error';

const reducer = (state, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Users: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { user: currentUser } = session;
  const [{ loading, error, users }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
    users: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/admin/users');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(error) });
      }
    };
    fetchData();
  }, []);
  const deleteUser = async (userId) => {
    const msg = confirm('Do you sure! delete this user?');
    if (msg) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        toast.success('User deleted successfully');
        router.reload();
      } catch (error) {
        toast.error(getError(error));
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
              <Link href="/admin/users">Users</Link>
            </li>
            <li>
              <Link href="/admin/products">Products</Link>
            </li>
            <li>
              <Link href="/admin/users" className="font-bold">
                Users
              </Link>
            </li>
          </ul>
        </div>

        <div className="overflow-x-auto md:col-span-3">
          <h1 className="mb-4 text-xl">Admin Users</h1>
          {loading ? (
            <div>loading...</div>
          ) : error ? (
            <div className="alert-error">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
                  <tr>
                    <th className="px-5 text-left">ID</th>
                    <th className="px-5 text-left">NAME</th>
                    <th className="px-5 text-left">EMAIL</th>
                    <th className="px-5 text-left">ADMIN</th>
                    <th className="px-5 text-left">CREATED AT</th>
                    <th className="px-5 text-left">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr className="border-b" key={user._id}>
                      <td className="p-5">{user._id.substring(20, 24)}</td>
                      <td className="p-5">{user.name}</td>
                      <td className="p-5">{user.email}</td>
                      <td className="p-5">{user.isAdmin ? 'yes' : 'no'}</td>
                      <td className="p-5">{user.createdAt.split('T')[0]}</td>
                      <td className="p-5">
                        {user._id !== currentUser._id && (
                          <button
                            className="default-button"
                            onClick={() => deleteUser(user._id)}
                          >
                            Delete
                          </button>
                        )}
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
Users.authed = { adminOnly: true };
export default Users;
