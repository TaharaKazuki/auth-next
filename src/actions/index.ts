'use server';

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

import { SignUpSchema, SignUpSchemaType } from '@/config/schema';
import { sendVerificationEmail } from '@/helpers';
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

export const verifyEmail = async (token: string) => {
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

  if (!existingToken) {
    return {
      error: 'Email does not exist',
    };
  }

  const confirmEmailAccount = await prisma.user.update({
    where: { id: existingUser?.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  const deleteToken =
    existingToken &&
    prisma.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

  await prisma.$transaction([confirmEmailAccount, deleteToken]);

  return {
    success: 'Email verified',
  };
};
