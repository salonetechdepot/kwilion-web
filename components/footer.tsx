import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { LogoText } from "./logoText";

export function Footer({
  className = "",
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Logo />
              <LogoText className="ml-0" showText={showText} />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Amplify your vision, from ideas to echos, through strategic
              technology solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-accent transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className="hover:text-accent transition-colors"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-accent transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <a
                  href={
                    process.env.NEXT_PUBLIC_DASHBOARD_URL ||
                    "https://roarbyte-dashboard-prod.onrender.com/login"
                  }
                  className="hover:text-accent transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-primary-foreground/80">
                Digital Strategy Consulting
              </li>
              <li className="text-primary-foreground/80">
                Web & App Development
              </li>
              <li className="text-primary-foreground/80">
                Workflow Automation
              </li>
              <li className="text-primary-foreground/80">
                Maintenance & Support
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  info@roarbyte.com
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  +232 75 088 075 <br /> +1 571 471 6384
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Herndon, Virginia USA.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  Freetown, Sierra Leone.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} RoarByte Tech Solutions LLC. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
