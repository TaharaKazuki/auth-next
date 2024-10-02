'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

import { verifyEmailAction } from '@/actions';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const VerifyEmailPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const getTokenValue = searchParams.get('token');

  const handelVerifyEmail = useCallback(() => {
    if (success || error) return;

    if (!handelVerifyEmail) {
      setError('Missing token value');
      return;
    }
    verifyEmailAction(getTokenValue)
      .then((data) => {
        if (data.success) {
          setSuccess(data.success);
          return router.push('/login');
        }
        setError(data.error || 'error');
      })
      .catch(() => setError('Error occurred Please try again'));
  }, [success, error, getTokenValue, router]);

  useEffect(() => {
    handelVerifyEmail();
  }, [handelVerifyEmail]);

  return (
    <div>
      {!success && !error && <h1>Verifying! Please wait</h1>}
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle>{success}</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
      {error ? (
        <Card>
          <CardHeader>
            <CardTitle>{error}</CardTitle>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
};

export default VerifyEmailPage;
