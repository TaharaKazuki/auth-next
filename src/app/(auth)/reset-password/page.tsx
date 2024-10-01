'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { resetPasswordAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ResetSchema, ResetSchemaType } from '@/config/schema';
import { useToast } from '@/hooks/use-toast';

const ResetPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const {
    register,
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

    startTransition(() => {
      resetPasswordAction(values).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
        }
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
    <Card className="w-[400px]">
      <CardHeader className="mb-2">
        <CardTitle className="text-3xl font-extrabold text-gray-900">
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="mt-2 w-full text-left text-sm font-bold text-red-700">
                {message}
              </p>
            )}
          />
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 w-full rounded-md bg-neutral-900 font-medium text-white"
          >
            Reset Password
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

export default ResetPasswordPage;
