import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma/client';

if (!process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID) {
  throw new Error('AUTH_GOOGLE_ID is not set');
}
if (!process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET) {
  throw new Error('AUTH_GOOGLE_SECRET is not set');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  adapter: PrismaAdapter(prisma),

  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
});
