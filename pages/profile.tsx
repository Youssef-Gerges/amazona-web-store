import axios from 'axios';
import Cookies from 'js-cookie';
import { signIn, signOut, useSession } from 'next-auth/react';
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import getError from '../utils/error';
import { Store } from '../utils/Store';

const Profile: React.FC = () => {
  const { state, dispatch } = useContext(Store);
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();

  useEffect(() => {
    setValue('name', session?.user?.name);
    setValue('email', session?.user?.email);
  }, [session, setValue]);

  const submitHandler = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password?: string;
  }) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });

      toast.success('Profile updated successfully');
      Cookies.remove('cart');
      dispatch({ type: 'CART_RESET_ACTION' });
      signOut({ callbackUrl: '/login' });
    } catch (error) {
      toast.error(getError(error));
    }
  };

  return (
    <Layout title="Update Profile">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Update Profile</h1>
        <div className="mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="name"
            className="w-full"
            id="name"
            autoFocus
            {...register('name', { required: 'please enter name' })}
          />
          {errors.name && (
            <div className="text-red-500">{errors.name.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="w-full"
            id="email"
            {...register('email', {
              required: 'please enter email',
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
            className="w-full"
            id="password"
            {...register('password', {
              minLength: {
                value: 8,
                message: 'password should be more than 7 chars',
              },
            })}
          />
          {errors.password && (
            <div className="text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="cpassword">confirm Password</label>
          <input
            type="password"
            className="w-full"
            id="cpassword"
            {...register('confirmPassword', {
              validate: (value) => value === getValues('password'),
            })}
          />
          {errors.confirmPassword && (
            <div className="text-red-500">{errors.confirmPassword.message}</div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === 'validate' && (
              <div className="text-red-500">Password do not match</div>
            )}
        </div>
        <div className="mb-4">
          <button className="primary-button">Update</button>
        </div>
      </form>
    </Layout>
  );
};

Profile.authed = true;
export default Profile;
