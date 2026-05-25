"use client";

import Link from "next/link";
import { Send } from "lucide-react";

// Inline social SVGs for robustness and styling
const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export default function Footer() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter submission logic
  };

  return (
    <footer className="bg-matte-black border-t border-luxury-gold/15 py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-40 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
        {/* Brand Column */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex flex-col items-start tracking-widest">
            <span className="text-2xl font-serif font-bold text-white">
              FANTASTICLIMO
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold/80 -mt-1">
              LUXURY CHAUFFEUR
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
            Experience the pinnacle of luxury, privacy, and safety. FantasticLimo provides elite chauffeur services tailored to dignitaries, executives, and VIPs worldwide.
          </p>
          <div className="flex gap-4">
            {[
              { icon: FacebookIcon, label: "Facebook" },
              { icon: TwitterIcon, label: "Twitter" },
              { icon: InstagramIcon, label: "Instagram" },
              { icon: LinkedinIcon, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white hover:border-luxury-gold hover:bg-luxury-gold/10 transition-all duration-300"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="text-luxury-gold font-serif text-sm uppercase tracking-widest mb-6 font-semibold">
            Services
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li>
              <Link href="/services/airport-transfers" className="hover:text-white transition-colors">
                Airport Transfers
              </Link>
            </li>
            <li>
              <Link href="/services/corporate-travel" className="hover:text-white transition-colors">
                Corporate Executive Travel
              </Link>
            </li>
            <li>
              <Link href="/services/wedding-chauffeur" className="hover:text-white transition-colors">
                Wedding Limousine
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-white transition-colors">
                VIP Event Transportation
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div>
          <h3 className="text-luxury-gold font-serif text-sm uppercase tracking-widest mb-6 font-semibold">
            Contact
          </h3>
          <ul className="flex flex-col gap-4 text-sm text-gray-400">
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Address</span>
              <span>100 VIP Boulevard, Suite 500, Dubai, UAE</span>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Phone</span>
              <a href="tel:+1234567890" className="hover:text-white transition-colors">
                +1 (234) 567-890
              </a>
            </li>
            <li className="flex flex-col">
              <span className="text-xs uppercase text-gray-500 tracking-wider">Email</span>
              <a href="mailto:concierge@fantasticlimo.com" className="hover:text-white transition-colors">
                concierge@fantasticlimo.com
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div>
          <h3 className="text-luxury-gold font-serif text-sm uppercase tracking-widest mb-6 font-semibold">
            Newsletter
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe to receive exclusive travel updates and fleet additions.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-dark-gray border border-luxury-gold/20 focus:border-luxury-gold/50 text-white placeholder-gray-500 px-4 py-3 text-xs outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-luxury-gold text-matte-black px-4 py-3 hover:bg-soft-gold transition-colors flex items-center justify-center"
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-16 pt-8 border-t border-luxury-gold/5 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <p>&copy; {new Date().getFullYear()} FantasticLimo Service. All Rights Reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
