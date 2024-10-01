'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NewPasswordSchema, NewPasswordSchemaType } from '@/config/schema';

const NewPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordSchemaType>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const handleSetNewPassword = () => {};

  return (
    <Card className="w-[400px]">
      <CardHeader className="mb-2">
        <CardTitle className="text-3xl font-extrabold text-gray-900 ">
          New Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleSetNewPassword)}
          className="space-y-4"
        >
          <Input
            id="password"
            placeholder="Please enter new password here."
            type="password"
            {...register('password')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
          />
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) => (
              <p className="mt-2 w-full text-left text-sm font-bold text-red-700">
                {message}
              </p>
            )}
          />
          <Button
            type="submit"
            className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
          >
            Change Password
          </Button>
          <p className="mt-8 flex justify-end text-sm text-gray-950">
            <Link
              href={'/login'}
              className="ml-1 whitespace-nowrap font-semibold text-blue-600 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewPasswordPage;
