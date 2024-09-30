import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

import config from './auth.config';
import prisma from './prisma';

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session }) {
      return session;
    },
    async signIn({ user }) {
      const { id } = user;
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });
      if (!existingUser?.emailVerified) return false;
      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  ...config,
});
