"use client";

import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case "OAuthAccountNotLinked":
      return "Please use the same Google account you used before.";
    case "AccessDenied":
      return "Access denied. Please make sure you are using an admin account.";
    case "Callback":
      return "There was a problem signing in. Please try again.";
    default:
      return error ? `Error: ${error}` : "";
  }
};

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isAdmin) {
      setIsRedirecting(true);
      router.push(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  const handleSignIn = async () => {
    try {
      await signIn("google", {
        callbackUrl,
      });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const isLoading = status === "loading";

  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-indigo-200">
            {isRedirecting ? "Redirecting to admin dashboard..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

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
              <p className="text-center text-sm">{getErrorMessage(error)}</p>
            </div>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <button
              onClick={handleSignIn}
              disabled={isLoading || isRedirecting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
