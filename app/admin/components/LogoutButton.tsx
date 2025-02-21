'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: '/admin/login',
      redirect: true 
    });
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800"
    >
      Sign Out
    </button>
  );
} 