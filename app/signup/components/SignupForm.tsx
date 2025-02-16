"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SignupMessage } from "./SignupMessage";
import { useVersion } from "@/lib/version/VersionContext";
import { getVersionContent, VERSIONS } from "@/lib/version/versionService";

// Client-side only wrapper for version-dependent content
function VersionContent({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading skeleton
  }

  return <>{children}</>;
}

export default function SignupForm() {
  const [error, setError] = useState<string[]>([]);
  const { version, setVersion, resolveVersion } = useVersion();
  const searchParams = useSearchParams();
  const versionParam = searchParams.get("version");

  useEffect(() => {
    // Special case for AI version and URL parameters
    const resolvedVersion = resolveVersion({
      urlVersion: versionParam,
    });
    setVersion(resolvedVersion);
  }, [versionParam, setVersion, resolveVersion]);

  // Get content based on version
  const content =
    versionParam === "ai"
      ? {
          title: "Deploy High-Performance AI Models with Ease",
          benefits: [
            {
              icon: "performance",
              title: "High-Performance Inference",
              description:
                "Deploy models with sub-100ms latency. Our optimized infrastructure ensures rapid response times for your AI applications.",
            },
            {
              icon: "scale",
              title: "Seamless Scalability",
              description:
                "Automatically scale from zero to thousands of concurrent requests. Our platform grows with your needs, ensuring consistent performance.",
            },
            {
              icon: "security",
              title: "Enterprise-Grade Security",
              description:
                "Benefit from SOC 2 Type II compliance, private networking, and end-to-end encryption. Your models and data remain secure and compliant.",
            },
          ],
          steps: [
            "Start with 5 free GPU hours",
            "Deploy your first AI model",
            "Scale with confidence",
          ],
        }
      : getVersionContent(version);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError([]);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Get form values
    const email = formData.get("user[email]") as string;
    const password = formData.get("user[password]") as string;
    const confirmPassword = formData.get("user[confirm_password]") as string;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(["Please enter a valid email address"]);
      return;
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(["Passwords do not match"]);
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            first_name: formData.get("user[first_name]"),
            last_name: formData.get("user[last_name]"),
            email: email,
            password: password,
            confirm_password: confirmPassword,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || ["Signup failed"]);
        return;
      }

      // Redirect to verification page
      window.location.href = data.redirectUrl;
    } catch (err) {
      console.error("Signup error:", err);
      setError([err instanceof Error ? err.message : "Failed to sign up"]);
    }
  };

  const handleGoogleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "/api/auth?provider=google&registration=true",
      );
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.redirectUrl;
      } else {
        setError([data.error || "Failed to initiate Google signup"]);
      }
    } catch (err) {
      console.error("Google signup error:", err);
      setError([
        err instanceof Error ? err.message : "Failed to initiate Google signup",
      ]);
    }
  };

  const handleEnterpriseSSO = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth?provider=enterprise");
      const data = await response.json();
      if (response.ok) {
        window.location.href = data.redirectUrl;
      } else {
        setError([data.error || "Failed to initiate Enterprise SSO"]);
      }
    } catch (err) {
      console.error("Enterprise SSO error:", err);
      setError([
        err instanceof Error
          ? err.message
          : "Failed to initiate Enterprise SSO",
      ]);
    }
  };

  return (
    <>
      <div className="w-full lg:w-1/2 p-6 lg:p-16">
        <div className="max-w-md mx-auto">
          <VersionContent>
            <h1 className="text-2xl font-bold text-gray-100 mb-8">
              Create a Release account
            </h1>
          </VersionContent>

          <form
            method="post"
            className="space-y-6"
            name="wf-form-user"
            data-name="user"
            id="wf-form-user"
            data-wf-page-id="64a307baf7e3b58f53defa95"
            data-wf-element-id="63ecc012-cbb9-5697-5950-19b506eaeccd"
            aria-label="user"
            onSubmit={handleSubmit}
            encType="application/x-www-form-urlencoded"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="user[first_name]"
                  className="block text-sm font-medium mb-2"
                >
                  First Name
                </label>
                <input
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={256}
                  name="user[first_name]"
                  data-name="First Name"
                  placeholder="First"
                  type="text"
                  id="user[first_name]"
                />
              </div>
              <div>
                <label
                  htmlFor="user[last_name]"
                  className="block text-sm font-medium mb-2"
                >
                  Last Name
                </label>
                <input
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={256}
                  name="user[last_name]"
                  data-name="Last Name"
                  placeholder="Last"
                  type="text"
                  id="user[last_name]"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="user[email]"
                className="block text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={256}
                name="user[email]"
                data-name="Email"
                placeholder="Email"
                type="email"
                id="user[email]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="user[password]"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={256}
                name="user[password]"
                data-name="Password"
                placeholder="*********"
                type="password"
                id="user[password]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="user[confirm_password]"
                className="block text-sm font-medium mb-2"
              >
                Confirm Password
              </label>
              <input
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={256}
                name="user[confirm_password]"
                data-name="Confirm Password"
                placeholder="*********"
                type="password"
                id="user[confirm_password]"
                required
              />
            </div>

            {error.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error.map((err, i) => (
                  <div key={i}>{err}</div>
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 px-4 rounded-lg transition duration-150 cursor-pointer"
            >
              Sign Up
            </button>
          </form>

          {/* SSO Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition duration-150"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          {/* Enterprise SSO Button */}
          <button
            onClick={handleEnterpriseSSO}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg border border-gray-700 transition duration-150 mt-3"
          >
            Enterprise SSO
          </button>

          {/* Terms and Privacy */}
          <p className="mt-6 text-sm text-gray-400 text-center">
            By signing up, you agree to our{" "}
            <Link
              href="/terms-of-service"
              className="text-blue-400 hover:text-blue-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy-policy"
              className="text-blue-400 hover:text-blue-300"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Show loading placeholder until we have content */}
      {content ? (
        <SignupMessage content={content} />
      ) : (
        <div className="w-full lg:w-1/2 bg-gray-800 p-6 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-700">
          <div className="max-w-xl mx-auto">
            <div className="h-8 bg-gray-700 rounded w-3/4 mb-8 animate-pulse" />
            <div className="space-y-8 lg:space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-12 w-12 bg-gray-700 rounded mb-4 animate-pulse" />
                    <div className="h-6 bg-gray-700 rounded w-2/3 mb-2 animate-pulse" />
                    <div className="h-16 bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
