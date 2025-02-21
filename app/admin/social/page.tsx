'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

type SocialAccount = {
  id: string;
  provider: 'linkedin' | 'twitter';
  providerAccountId: string;
  metadata?: Record<string, any>;
};

export default function SocialMediaPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
    
    // Handle URL parameters
    const urlError = searchParams.get('error');
    const urlSuccess = searchParams.get('success');
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // Handle Twitter OAuth callback
    if (code && state) {
      // Directly redirect to callback with parameters
      const params = new URLSearchParams({
        code: code,
        state: state
      });

      const callbackUrl = `/api/admin/twitter/callback?${params.toString()}`;
      console.log('Redirecting to callback URL:', callbackUrl);

      // Redirect to the callback URL
      window.location.replace(callbackUrl);
      return;
    }
    
    if (urlError) {
      setError(getErrorMessage(urlError));
    }
    if (urlSuccess) {
      setSuccess(getSuccessMessage(urlSuccess));
    }
  }, [searchParams]);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/admin/social-accounts');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch accounts');
      }
      
      setAccounts(data.accounts);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch connected accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      const response = await fetch(`/api/admin/social-accounts?id=${accountId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to disconnect account');
      }
      
      await fetchAccounts();
      setSuccess('Account disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting account:', error);
      setError(error instanceof Error ? error.message : 'Failed to disconnect account');
    }
  };

  const handleConnectLinkedIn = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/linkedin/auth');
      const data = await response.json();
      
      if (data.error) {
        console.error('LinkedIn auth error:', data.error);
        setError('Failed to start LinkedIn authentication');
        return;
      }

      if (!data.authUrl) {
        console.error('No auth URL returned:', data);
        setError('Failed to get LinkedIn authentication URL');
        return;
      }

      console.log('Redirecting to LinkedIn:', data.authUrl);
      console.log('Redirect URI configured as:', data.redirectUri);

      // Redirect to LinkedIn's authorization page
      window.location.assign(data.authUrl);
    } catch (error) {
      console.error('Error starting LinkedIn auth:', error);
      setError('Failed to start LinkedIn authentication');
    }
  };

  const handleConnectTwitter = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/twitter/auth');
      const data = await response.json();
      
      if (data.error) {
        console.error('Twitter auth error:', data.error);
        setError('Failed to start Twitter authentication');
        return;
      }

      if (!data.authUrl) {
        console.error('No auth URL returned:', data);
        setError('Failed to get Twitter authentication URL');
        return;
      }

      console.log('Redirecting to Twitter:', data.authUrl);
      console.log('Redirect URI configured as:', data.redirectUri);

      // Redirect to Twitter's authorization page
      window.location.assign(data.authUrl);
    } catch (error) {
      console.error('Error starting Twitter auth:', error);
      setError('Failed to start Twitter authentication');
    }
  };

  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'linkedin_auth_failed':
        return 'LinkedIn authentication failed. Please try again.';
      case 'linkedin_connection_failed':
        return 'Failed to connect LinkedIn account. Please try again.';
      case 'twitter_auth_failed':
        return 'Twitter authentication failed. Please try again.';
      case 'twitter_connection_failed':
        return 'Failed to connect Twitter account. Please try again.';
      case 'missing_params':
        return 'Invalid authentication response. Please try again.';
      case 'database_connection_error':
        return 'Database connection error. Please try again later.';
      default:
        return 'An error occurred. Please try again.';
    }
  };

  const getSuccessMessage = (code: string) => {
    switch (code) {
      case 'linkedin_connected':
        return 'LinkedIn account connected successfully!';
      case 'twitter_connected':
        return 'Twitter account connected successfully!';
      default:
        return 'Operation completed successfully!';
    }
  };

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/4 mb-8"></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="h-32 bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-white">Social Media Accounts</h1>
        <p className="mt-1 text-sm text-gray-300">
          Connect your social media accounts to enable AI-powered posting.
        </p>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-md">
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-md">
            <p className="text-sm text-green-200">{success}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* LinkedIn Card */}
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">LinkedIn</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Share updates and articles on your LinkedIn profile
                </p>
              </div>
              <button
                onClick={handleConnectLinkedIn}
                disabled={accounts.some(a => a.provider === 'linkedin')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  accounts.some(a => a.provider === 'linkedin')
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800'
                }`}
              >
                {accounts.some(a => a.provider === 'linkedin') ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white">Twitter</h3>
                <p className="mt-1 text-sm text-gray-300">
                  Post tweets and engage with your Twitter audience
                </p>
              </div>
              <button
                onClick={handleConnectTwitter}
                disabled={accounts.some(a => a.provider === 'twitter')}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  accounts.some(a => a.provider === 'twitter')
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800'
                }`}
              >
                {accounts.some(a => a.provider === 'twitter') ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        </div>

        {/* Connected Accounts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-medium text-white">Connected Accounts</h2>
          <div className="mt-4 space-y-4">
            {accounts.length === 0 ? (
              <p className="text-gray-300 text-sm">No accounts connected yet.</p>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-gray-800 shadow rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="text-white font-medium">
                      {account.provider.charAt(0).toUpperCase() + account.provider.slice(1)}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {account.metadata?.profile?.firstName
                        ? `${account.metadata.profile.firstName} ${account.metadata.profile.lastName}`
                        : `Account ID: ${account.providerAccountId}`}
                    </p>
                  </div>
                  <button
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                    onClick={() => handleDisconnect(account.id)}
                  >
                    Disconnect
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 