'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from '@/components/theme-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
      <NextUIProvider>{children}</NextUIProvider>
    </ThemeProvider>
  );
}
