import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage = () => {
  return (
    <div className="max-w-md rounded-lg border border-gray-300 p-6 shadow-sm max-md:mx-auto">
      <form className="space-y-4">
        <div className="mb-8">
          <h3 className="text-3xl font-extrabold text-gray-900">Sign Up</h3>
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            User Name
          </Label>
          <div className="relative flex items-center">
            <Input
              name="name"
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            Email
          </Label>
          <div className="relative flex items-center">
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 block text-xl font-bold text-gray-800">
            Password
          </Label>
          <div className="relative flex items-center">
            <Input
              name="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-blue-500"
            />
          </div>
          <div className="mt-8">
            <Button
              type="submit"
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
