import type { Metadata } from 'next';
import './globals.css';
import NavBar from './_components/NavBar';
import { Providers } from './_components/providers';
import { inter, satisfy } from './_components/fonts';

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
      <body className='font-inter min-h-svh'>
        <Providers>
          <NavBar />
          <main className='container'>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
