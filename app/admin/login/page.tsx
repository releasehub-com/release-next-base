'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const handleSignIn = async () => {
    await signIn('google', {
      callbackUrl: '/admin'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Sign in with your admin Google account
          </p>
          {error && (
            <div className="mt-2 p-2 bg-red-900/50 border border-red-500 text-red-200 rounded">
              <p className="text-center text-sm">
                Access denied. Please make sure you are using an admin account.
              </p>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 