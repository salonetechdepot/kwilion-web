"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { LogoText } from "./logoText";

export function Navigation({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const DASHBOARD_URL =
    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
    "https://roarbyte-dashboard.onrender.com/login";

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Logo />
            <LogoText className="text-accent" showText={showText} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium hover:text-accent text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-sm font-medium hover:text-accent text-primary transition-colors"
            >
              Services
            </Link>
            <Link
              href="/work"
              className="text-sm font-medium hover:text-accent text-primary transition-colors"
            >
              Our Work
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-accent text-primary transition-colors"
            >
              About Us
            </Link>
            <a
              href={DASHBOARD_URL}
              className="text-sm font-medium hover:text-accent text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dashboard
            </a>
            <Link href="/contact">
              <Button className="bg-accent hover:bg-accent/90 hover:text-primary">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link
              href="/"
              className="block text-sm font-medium hover:text-accent text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services"
              className="block text-sm font-medium hover:text-accent text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/work"
              className="block text-sm font-medium hover:text-accent text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Our Work
            </Link>
            <Link
              href="/about"
              className="block text-sm font-medium hover:text-accent text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <a
              href={DASHBOARD_URL}
              className="block text-sm font-medium hover:text-accent text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Dashboard
            </a>

            <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-accent hover:bg-accent/90 hover:text-primary">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
