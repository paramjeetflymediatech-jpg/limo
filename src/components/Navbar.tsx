"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { triggerPhoneGtagConversion } from "@/lib/gtag";

const staticNavLinks = [
  { name: "Home", href: "/" },
  { name: "Fleet", href: "/fleet" },
  { name: "About Us", href: "/about" },
  { name: "Become a Partner", href: "/become-a-partner" },
  { name: "Blogs", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    staticNavLinks[0], // Home
    staticNavLinks[1], // Fleet
    {
      name: "Services",
      href: "/services",
    },
    ...staticNavLinks.slice(2), // About Us, Contact
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full z-40 transition-all duration-500 bg-white py-4 shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative w-44 h-12 flex items-center justify-start group">
            <Image
              src="/logos.png"
              alt="Fantastic Limo Logo"
              fill
              sizes="176px"
              className="object-contain object-left"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link: any) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold hover:text-luxury-gold transition-colors relative py-2 ${pathname === link.href || (link.name === "Services" && pathname.startsWith("/services")) ? "text-luxury-gold" : "text-gray-800"
                  }`}
              >
                {link.name}
                {(pathname === link.href || (link.name === "Services" && pathname.startsWith("/services"))) && (
                  <motion.span
                    layoutId="navActiveLine"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold"
                  />
                )}
              </Link>


            )
            )}
          </nav>

          {/* Booking CTA Button */}
          <div className="hidden xl:flex items-center gap-4">
            <a
              href="tel:+17786880333"
              onClick={triggerPhoneGtagConversion}
              className="relative inline-flex items-center justify-center text-sm font-semibold text-gray-900 bg-transparent transition-all duration-300 group overflow-hidden px-2 py-1"
            >
              <Phone className="w-4 h-4 text-luxury-gold group-hover:scale-110 transition-transform duration-200" />
              <span className="relative z-10 p-2 group-hover:text-luxury-gold">+1 778 688 0333</span>
            </a>
            <Link
              href="/booking"
              className="relative inline-flex items-center justify-center px-6 py-3 border border-luxury-gold hover:border-luxury-gold text-sm font-semibold text-gray-900 bg-transparent hover:bg-luxury-gold hover:text-white transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Book Reservation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#D0A511] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </Link>
          </div>

          {/* Mobile Right Controls: Phone Trigger + Mobile Menu Trigger */}
          <div className="flex xl:hidden items-center gap-3">
            <a
              href="tel:+17786880333"
              onClick={triggerPhoneGtagConversion}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-luxury-gold/10 text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 border border-luxury-gold/30 shadow-sm"
              aria-label="Call +1 778 688 0333"
              title="Call Concierge"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-900 hover:text-luxury-gold transition-colors z-50 p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-matte-black/95 backdrop-blur-md flex flex-col justify-center items-center overflow-y-auto py-20"
          >
            <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm px-8">
              {navLinks.map((link: any, idx: any) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="w-full"
                >
                  <Link
                    href={link.href}
                    className={`text-2xl font-serif hover:text-luxury-gold transition-colors ${pathname === link.href || (link.name === "Services" && pathname.startsWith("/services")) ? "text-luxury-gold" : "text-white"
                      }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08 }}
                className="mt-4 flex flex-col gap-3 w-full"
              >
                <a
                  href="tel:+17786880333"
                  onClick={triggerPhoneGtagConversion}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 border border-luxury-gold text-base text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 font-semibold"
                >
                  <Phone className="w-5 h-5 text-luxury-gold" />
                  <span>Call +1 778 688 0333</span>
                </a>
                <Link
                  href="/booking"
                  className="flex items-center justify-center px-8 py-3.5 bg-luxury-gold text-white text-base font-semibold hover:brightness-110 transition-all duration-300"
                >
                  Book Reservation
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
