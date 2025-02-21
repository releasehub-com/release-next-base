import { getServerSession } from "next-auth";
import Link from "next/link";
import { headers } from "next/headers";
import LogoutButton from "./components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";

  // Don't apply this layout to the login page
  if (pathname === "/admin/login") {
    return children;
  }

  const session = await getServerSession();

  // If no session, render nothing (middleware will handle redirect)
  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-white">
                  Admin Dashboard
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/admin/social"
                  className="border-transparent text-gray-300 hover:border-gray-300 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Social Media
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-900 text-indigo-200">
                  {session.user.email}
                </span>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
} 