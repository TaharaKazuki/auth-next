'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { signUpAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpSchema, SignUpSchemaType } from '@/config/schema';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const signUpHandler = (values: SignUpSchemaType) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      signUpAction(values).then((data) => {
        setError(data.error!);
        setSuccess(data.success!);
        reset();
      });
    });
  };

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [success, toast]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  return (
    <div className="max-w-md rounded-lg border border-gray-300 p-6 shadow-sm max-md:mx-auto">
      <form onSubmit={handleSubmit(signUpHandler)} className="space-y-4">
        <div className="mb-8">
          <h3 className="text-3xl font-extrabold text-gray-900">Sign Up</h3>
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            User Name
          </Label>
          <div className="relative flex items-center">
            <Input
              type="text"
              placeholder="Enter your name"
              {...register('name')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="name"
            render={({ message }) => (
              <p className="w-full text-left text-sm font-bold text-red-700">
                {message}
              </p>
            )}
          />
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
          <div className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
            >
              Sign up
            </Button>
          </div>
          <p className="mt-8 text-center text-sm text-gray-950">
            Already hove an account
            <Link
              href={'/login'}
              className="ml-1 whitespace-nowrap font-semibold text-blue-600 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
