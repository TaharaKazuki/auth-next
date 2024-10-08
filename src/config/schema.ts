import * as z from 'zod';

export const SignUpSchema = z.object({
  name: z.string().min(3, {
    message: 'Name is required',
  }),
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Password has be to minimum 6 characters',
  }),
});

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignInScheme = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Password has be to minimum 6 characters',
  }),
});

export type SignInSchemaType = z.infer<typeof SignInScheme>;

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export type ResetSchemaType = z.infer<typeof ResetSchema>;

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Password has be to minimum 6 characters',
  }),
});

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
