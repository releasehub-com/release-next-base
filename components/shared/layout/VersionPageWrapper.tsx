"use client";

import { Suspense, useState, useEffect } from "react";
import { VersionProvider } from "@/lib/version/VersionContext";
import Header from "./Header";
import Footer from "./Footer";

function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded w-1/3 mb-12"></div>
          <div className="h-96 bg-gray-800 rounded mb-8"></div>
          <div className="h-12 bg-gray-800 rounded mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageContentWrapper({
  children,
  includeLayout = false,
}: {
  children: React.ReactNode;
  includeLayout?: boolean;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return includeLayout ? (
      <>
        <Header />
        <LoadingState />
        <Footer />
      </>
    ) : (
      <LoadingState />
    );
  }

  if (includeLayout) {
    return (
      <>
        <Header />
        <Suspense fallback={<LoadingState />}>{children}</Suspense>
        <Footer />
      </>
    );
  }

  return <Suspense fallback={<LoadingState />}>{children}</Suspense>;
}

export default function VersionPageWrapper({
  children,
  includeLayout = false,
}: {
  children: React.ReactNode;
  includeLayout?: boolean;
}) {
  return (
    <VersionProvider>
      <PageContentWrapper includeLayout={includeLayout}>
        {children}
      </PageContentWrapper>
    </VersionProvider>
  );
}
