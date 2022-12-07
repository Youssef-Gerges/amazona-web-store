import Link from 'next/link';
import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import getError from '../utils/error';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const login: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [session, router, redirect]);

  const loginHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error(getError(error));
    }
  };
  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(loginHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="w-full"
            autoFocus
            {...register('email', {
              required: 'Please enter email',
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                message: 'Please enter a valid email',
              },
            })}
          />
          {errors.email && (
            <div className="text-red-500">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="w-full"
            {...register('password', {
              required: 'Please enter password',
              minLength: { value: 5, message: 'Password is more than 5 chars' },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Login</button>
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href="/register">Register new account</Link>
        </div>
      </form>
    </Layout>
  );
};

export default login;
