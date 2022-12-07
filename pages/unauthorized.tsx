import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';

const unauthorized = () => {
  const router = useRouter();
  const { message } = router.query;
  return (
    <Layout title="unauthorized">
      <h1 className="text-xl">Access denied</h1>
      {message && <div className="mb-4 text-red-500">{message}</div>}
    </Layout>
  );
};

export default unauthorized;
