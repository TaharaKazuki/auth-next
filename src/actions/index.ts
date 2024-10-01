'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';
import { v4 as uuidv4 } from 'uuid';

import { signIn, signOut } from '@/auth';
import {
  ResetSchema,
  ResetSchemaType,
  SignInSchemaType,
  SignInScheme,
  SignUpSchema,
  SignUpSchemaType,
} from '@/config/schema';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/helpers';
import prisma from '@/prisma';

const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);

  const existingToken = await prisma.verificationToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

export const signUpAction = async (formValues: SignUpSchemaType) => {
  const validateFields = SignUpSchema.safeParse(formValues);

  if (!validateFields.success) {
    return {
      error: 'Invalid fields',
    };
  }

  const { name, email, password } = validateFields.data;

  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return {
      error: 'Email already in use. Please try with a different Email',
    };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  const createVerificationToken = await generateVerificationToken(email);
  console.info(createVerificationToken);

  await sendVerificationEmail(email, createVerificationToken.token);

  return {
    success: 'Email verification sent! Please check your email',
  };
};

export const verifyEmailAction = async (token: string | null) => {
  if (!token)
    return {
      error: 'Query Token does not exist',
    };
  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!existingToken) {
    return {
      error: 'Token does not exist',
    };
  }

  const isTokenExpired = new Date(existingToken.expires) < new Date();

  if (isTokenExpired) {
    return {
      error: 'Token has expired',
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!existingUser) {
    return {
      error: 'Email does not exist',
    };
  }

  const confirmEmailAccount = prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
    },
  });

  const deleteToken = prisma.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  await prisma.$transaction([confirmEmailAccount, deleteToken]);

  return {
    success: 'Email verified',
  };
};

export const signInAction = async (formValues: SignInSchemaType) => {
  const validateFields = SignInScheme.safeParse(formValues);

  if (!validateFields.success) {
    return {
      error: 'Invalid Fields',
    };
  }

  const { email, password } = validateFields.data;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser || !existingUser.email) {
    return {
      error: 'Email does not exist',
    };
  }

  if (!(await bcrypt.compare(password, existingUser.password!))) {
    return {
      error: 'Invalid password',
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: 'Confirmation email sent',
    };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/users',
    });

    return {
      success: 'Successfully logged in',
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError' || 'CredentialsSignin':
          return {
            error: 'Invalid credentials',
          };

        default:
          return {
            error: 'Something went wrong',
          };
      }
    }

    throw error;
  }
};

export const logoutAction = async () => {
  await signOut({
    redirectTo: '/login',
  });
};

export const resetPasswordAction = async (formValues: ResetSchemaType) => {
  const validateFields = ResetSchema.safeParse(formValues);

  if (!validateFields.data) {
    return {
      error: 'Invalid fields',
    };
  }

  const { email } = validateFields.data;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return {
      error: 'Email not found',
    };
  }

  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000);
  const existingToken = await prisma.passwordResetToken.findFirst({
    where: { email },
  });

  if (existingToken) {
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return {
    success: 'Reset email send! Please check your inbox',
  };
};
