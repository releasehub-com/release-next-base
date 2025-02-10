"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getVersionFromStorage, getVersionPath } from "@/config/versions";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: "Blog", href: "/blog" },
    // ... other navigation items ...
  ];

  // Get the stored version for the logo link
  const getHomeUrl = () => {
    const version = getVersionFromStorage();
    return getVersionPath(version);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900 text-gray-100 transition-all duration-300 ${isScrolled ? "py-2" : "py-4"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href={getHomeUrl()} className="flex items-center space-x-2">
            <Image
              alt="Release Logo"
              src="/images/logos/release-logo.svg"
              width={120}
              height={32}
              className="h-8 w-auto"
              unoptimized={true}
            />
          </Link>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          <nav
            className={`${isMenuOpen ? "flex" : "hidden"} absolute top-full left-0 right-0 flex-col bg-gray-800 p-4 md:relative md:flex md:flex-row md:items-center md:space-x-4 md:p-0 md:bg-transparent`}
          >
            <Link
              href="/#features"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Features
            </Link>
            <Link
              href="https://release.com/pricing"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Pricing
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              How it Works
            </Link>
            <Link
              href="/case-studies"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Case Studies
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Blog
            </Link>
            <Link
              href="https://docs.release.com"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Docs
            </Link>
            <Link
              href="https://release.ai"
              className="text-sm font-medium hover:text-gray-300 py-2 md:py-0"
            >
              Release.ai
            </Link>
            <div className="md:hidden mt-4">
              <Link
                href="https://web.release.com/login"
                className="block text-sm font-medium hover:text-gray-300 py-2"
              >
                Login
              </Link>
              <Link href="/signup" className="block mt-2">
                <Button className="w-full bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="https://web.release.com/login"
              className="text-sm font-medium hover:text-gray-300"
            >
              Login
            </Link>
            <Link href="/signup">
              <Button className="bg-[#00bb93] text-white hover:bg-[#00bb93]/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
