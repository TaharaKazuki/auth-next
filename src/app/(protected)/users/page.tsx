import Logout from '@/app/components/logout';
import { auth } from '@/auth';
import { Card, CardContent } from '@/components/ui/card';

const UsersPage = async () => {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-6">
          <div>
            <h1 className="mb-4 text-2xl font-bold">
              Name is {session?.user?.name}
            </h1>
            <p>Email is {session?.user?.email}</p>
          </div>
          <Logout />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
