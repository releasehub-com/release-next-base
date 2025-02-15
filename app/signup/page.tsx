import type { Metadata } from "next";
import SignupForm from "./components/SignupForm";
import VersionPageWrapper from "@/components/shared/layout/VersionPageWrapper";
import { metadata } from "./metadata";

export { metadata };

export default function SignupPage() {
  return (
    <VersionPageWrapper includeLayout={true}>
      <main className="min-h-screen bg-gray-900">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <SignupForm />
        </div>
      </main>
    </VersionPageWrapper>
  );
}
