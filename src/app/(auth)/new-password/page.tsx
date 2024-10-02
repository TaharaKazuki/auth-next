'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { newPasswordAction } from '@/actions';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NewPasswordSchema, NewPasswordSchemaType } from '@/config/schema';
import { useToast } from '@/hooks/use-toast';

const NewPasswordPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { toast } = useToast();

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

  const handleSetNewPassword = (values: NewPasswordSchemaType) => {
    setError(null);
    setSuccess(null);

    startTransition(() => {
      newPasswordAction(values, token!).then((data) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          setSuccess(data.success);
          router.push('/login');
        }
      });
    });
  };

  useEffect(() => {
    if (error) {
      toast({
        title: error,
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (success) {
      toast({
        title: success,
      });
    }
  }, [success, toast]);

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
            disabled={isPending}
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
