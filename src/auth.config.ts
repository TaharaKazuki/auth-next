import bcrypt from 'bcryptjs';
import { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { SignInScheme } from './config/schema';
import prisma from './prisma';

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validateFields = SignInScheme.safeParse(credentials);

        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !user.password) return null;
          const checkPassword = await bcrypt.compare(password, user.password);
          if (checkPassword) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
