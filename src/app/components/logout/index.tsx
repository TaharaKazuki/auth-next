'use client';

import { logoutAction } from '@/actions';
import { Button } from '@/components/ui/button';

const Logout = () => {
  const handleLogout = async () => {
    await logoutAction();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
