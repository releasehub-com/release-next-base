'use client';

import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
        <div className="bg-gray-800 shadow rounded-lg mt-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-white">Welcome to the Admin Dashboard</h2>
            <p className="mt-1 text-sm text-gray-300">
              Manage your social media presence and AI marketing assistant from here.
            </p>
            
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative rounded-lg border border-gray-700 bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-600 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href="/admin/social" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-white">Social Media Accounts</p>
                    <p className="text-sm text-gray-300">Connect and manage your social media accounts</p>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-700 bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-600 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href="/admin/scheduled" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-white">Scheduled Posts</p>
                    <p className="text-sm text-gray-300">View and manage your scheduled social media posts</p>
                  </Link>
                </div>
              </div>

              <div className="relative rounded-lg border border-gray-700 bg-gray-800 px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-600 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href="/admin/settings" className="focus:outline-none">
                    <span className="absolute inset-0" aria-hidden="true" />
                    <p className="text-sm font-medium text-white">AI Assistant Settings</p>
                    <p className="text-sm text-gray-300">Configure your AI marketing assistant preferences</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 