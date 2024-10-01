'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ResetSchema, ResetSchemaType } from '@/config/schema';
import { useToast } from '@/hooks/use-toast';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchemaType>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleResetPassword = (values: ResetSchemaType) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {});
  };

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  return (
    <Card className="w-[400px]">
      <CardHeader className="mb-2">
        <CardTitle className="text-gray-900 text-3xl font-extrabold">
          Password Reset
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4"
        >
          <Input
            id="email"
            placeholder="Please enter your email here."
            type="email"
            {...register('email')}
            className="w-full text-sm text-gray-800 border border-gray-300 px-4 py-3 rounded-lg outline-blue-500"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-700 mt-2 text-sm font-bold text-left w-full">
                {message}
              </p>
            )}
          />
          <Button
            type="submit"
            className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
          >
            Reset Password
          </Button>
          <p className="text-sm mt-8 flex justify-end text-gray-950">
            <Link
              href={'/login'}
              className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap"
            >
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
