'use client';

import { ThemeProvider } from '@/app/_components/theme-provider';
import { NextUIProvider } from '@nextui-org/react';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { Theme } from '@radix-ui/themes';
import 'react-toastify/dist/ReactToastify.css';
import QueryClientProvider from './QueryClientProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
        <NextUIProvider>
          <ToastContainer
            position='top-right'
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            limit={5}
          />
          <SessionProvider>
            <Theme>{children}</Theme>
          </SessionProvider>
        </NextUIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
