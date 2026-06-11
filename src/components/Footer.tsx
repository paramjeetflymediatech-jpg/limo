"use client";

import Link from "next/link";
import Image from "next/image";
import { Send } from "lucide-react";
import { useState } from "react";

// Inline social SVGs for robustness and styling
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    }, 1000);
  };

  return (
    <footer className="bg-matte-black border-t border-luxury-gold/15 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="relative w-56 h-28 flex items-center justify-start">
            <Image
              src="/logos.png"
              alt="Fantastic Limo Logo"
              fill
              sizes="224px"
              className="object-contain object-left"
              style={{ filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.35))" }}
              priority
            />
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Experience the pinnacle of luxury, privacy, and safety. FantasticLimo provides elite chauffeur services tailored to dignitaries, executives, and VIPs worldwide.
          </p>
          <div className="flex gap-4">
            {[
              { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com" },
              { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
              { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com" },
              { icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-[#D0A511] hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-[#D0A511] font-serif text-sm uppercase tracking-widest mb-6 font-black">
            Services
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li>
              <Link href="/services/airport-transfers" className="transition-colors">
                Airport Transfers
              </Link>
            </li>
            <li>
              <Link href="/services/corporate-travel" className="transition-colors">
                Corporate Executive Travel
              </Link>
            </li>
            <li>
              <Link href="/services/wedding-chauffeur" className="transition-colors">
                Wedding Limousine
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition-colors">
                VIP Event Transportation
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="text-[#D0A511] font-serif text-sm uppercase tracking-widest mb-6 font-black">
            Contact
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Address</span>
              <span>Vancouver,BC, Canada</span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Phone</span>
              <a href="tel:+17786880333" className="transition-colors">
                +1 (778) 688-0333
              </a>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Email</span>
              <a href="mailto:info@fantasticlimo.ca" className="transition-colors">
                info@fantasticlimo.ca
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="text-[#D0A511] font-serif text-sm uppercase tracking-widest mb-6 font-black">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to receive exclusive travel updates and fleet additions.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-dark-gray border border-luxury-gold/20 focus:border-luxury-gold/50 text-white placeholder-gray-500 px-4 py-3 text-xs outline-none transition-colors disabled:opacity-50"
                required
                disabled={status === "loading" || status === "success"}
              />
              <button
                type="submit"
                className="bg-luxury-gold text-matte-black px-4 py-3 hover:bg-soft-gold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Subscribe"
                disabled={status === "loading" || status === "success"}
              >
                {status === "loading" ? (
                  <div className="w-4 h-4 border-2 border-matte-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            {status === "success" && (
              <p className="text-[#D0A511] text-xs">Thank you for subscribing!</p>
            )}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-luxury-gold/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>&copy; {new Date().getFullYear()} FantasticLimo Service. All Rights Reserved.</p>
        <div className="flex gap-6">
          <Link href="/become-a-partner" className="transition-colors">Become a Partner</Link>
          <Link href="/privacy-policy" className="transition-colors">Privacy Policy</Link>
          <Link href="/terms-of-service" className="transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
