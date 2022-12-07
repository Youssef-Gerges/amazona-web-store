import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { StoreProvider } from '../utils/Store';
import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const paypalConfigs = {
    'client-id':
      '########',
  };
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.authed ? (
          <AuthWrapper adminOnly={Component.authed.adminOnly ?? false}>
            <PayPalScriptProvider options={paypalConfigs}>
              <Component {...pageProps} />
            </PayPalScriptProvider>
          </AuthWrapper>
        ) : (
          <Component {...pageProps} />
        )}
      </StoreProvider>
    </SessionProvider>
  );
}

const AuthWrapper: React.FC<{
  children: React.ReactNode;
  adminOnly: boolean;
}> = ({ children, adminOnly }) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=login required');
    },
  });

  if (status === 'loading') {
    return <div>Loading..</div>;
  }

  if (adminOnly && !session.user?.isAdmin) {
    router.push('/unauthorized?message=admin login required');
  }
  return children;
};
