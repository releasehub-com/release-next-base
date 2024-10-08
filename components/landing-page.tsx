import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Phone, DollarSign, Package, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="font-sans leading-normal tracking-normal">
      {/* Header */}
      <header className="bg-green-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">Emerald Moving & Storage</div>
          <nav>
            <a href="#services" className="mx-2">
              Services
            </a>
            <a href="#contact" className="mx-2">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl mb-4">Reliable Moving and Storage Solutions</h1>
          <p className="text-xl mb-6">Making your move effortless and worry-free.</p>
          <Button className="bg-white text-green-700">Get a Free Quote</Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Our Services</h2>
          <div className="flex justify-around">
            <Card className="flex flex-col items-center p-6">
              <Package className="w-16 h-16 text-green-700 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Professional Moving</h3>
              <p>Expert handling of your belongings with care.</p>
            </Card>
            <Card className="flex flex-col items-center p-6">
              <DollarSign className="w-16 h-16 text-green-700 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Secure Storage</h3>
              <p>Safe and secure storage for your items.</p>
            </Card>
            <Card className="flex flex-col items-center p-6">
              <Clock className="w-16 h-16 text-green-700 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Timely Service</h3>
              <p>Prompt and efficient service you can rely on.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Contact Us</h2>
          <form className="max-w-lg mx-auto">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded border"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded border"
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                placeholder="Phone"
                className="w-full p-3 rounded border"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Message"
                className="w-full p-3 rounded border"
                rows={5}
              ></textarea>
            </div>
            <Button className="bg-green-700 text-white">Send Message</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>© 2023 Emerald Moving & Storage</p>
          <div className="mt-2">
            <a href="#" className="mx-2">
              Terms of Service
            </a>
            <a href="#" className="mx-2">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

