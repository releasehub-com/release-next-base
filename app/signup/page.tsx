import SignupForm from "./components/SignupForm";
import Header from "@/components/shared/layout/Header";
import Footer from "@/components/shared/layout/Footer";

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="flex flex-col lg:flex-row min-h-screen">
          <SignupForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
