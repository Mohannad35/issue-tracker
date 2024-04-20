import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { inter, satisfy } from './_components/fonts';
import NavBar from './_components/NavBar';
import { Providers } from './_components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Issue Tracker',
  description: 'Issue Tracker application built with Next.js and Prisma',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className={`${inter.variable} ${satisfy.variable}`}>
      <body className='min-h-svh'>
        <Providers>
          <NavBar />
          <main className='container font-inter'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
