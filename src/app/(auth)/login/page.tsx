'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { signInAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignInSchemaType, SignInScheme } from '@/config/schema';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInScheme),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInHandler = (values: SignInSchemaType) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      signInAction(values)
        .then((data) => {
          if (data.error) {
            reset();
            setError(data.error);
          }
          if (data.success) {
            reset();
            setSuccess(data.success);
          }
        })
        .catch((error) => {
          setError(error);
        });
    });
  };

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [toast, success]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: 'destructive',
      });
    }
  }, [toast, error]);

  return (
    <div className="max-w-md rounded-lg border border-gray-300 p-6 shadow-sm max-md:mx-auto">
      <form onSubmit={handleSubmit(signInHandler)} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-3xl font-extrabold text-gray-900">SignIn</h3>
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            Email
          </Label>
          <div className="relative flex items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="w-full text-left text-sm font-bold text-red-700">
                {message}
              </p>
            )}
          />
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            Password
          </Label>
          <div className="relative flex items-center">
            <Input
              type="password"
              placeholder="Enter your password"
              {...register('password')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p className="w-full text-left text-sm font-bold text-red-700">
                {message}
              </p>
            )}
          />
          <div className="mt-2 flex flex-wrap items-center justify-end gap-4">
            <div className="text-sm">
              <Link
                href={'/rest-password'}
                className="font-semibold text-blue-700 hover:underline"
              >
                Forgot your password
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <Button
              type="submit"
              className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
            >
              Log In
            </Button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-950">
            {' '}
            Don&apos;t have an account
            <Link
              href={'/register'}
              className="ml-1 whitespace-nowrap font-semibold text-blue-600 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
