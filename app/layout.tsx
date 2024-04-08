import type { Metadata } from 'next';
import './globals.css';
import NavBar from './NavBar';
import { Providers } from './providers';
import { inter, satisfy } from './fonts';

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
    <html lang='en' className={`${inter.variable} ${satisfy.variable}`}>
      <body className='font-inter min-h-svh'>
        <Providers>
          <NavBar />
          <main className='px-5'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
