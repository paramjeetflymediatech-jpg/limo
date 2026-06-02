"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const staticNavLinks = [
  { name: "Home", href: "/" },
  { name: "Fleet", href: "/fleet" },
  { name: "About Us", href: "/about" },
  { name: "Become a Partner", href: "/become-a-partner" },
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
          <Link href="/" className="flex flex-col items-start tracking-widest group">
            <span className="text-xl md:text-2xl font-serif font-bold text-gray-900 group-hover:text-luxury-gold transition-colors duration-300">
              FANTASTIC <span className="text-luxury-gold">LIMO</span>
            </span>
            <span className="text-[9px] uppercase text-gray-800 -mt-1 font-semibold">
              WHERE EVERY RIDE IS AN EXPERIENCE
            </span>

          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
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
            ))}
          </nav>

          {/* Booking CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/booking"
              className="relative inline-flex items-center justify-center px-6 py-3 border border-luxury-gold hover:border-luxury-gold text-sm font-semibold text-gray-900 bg-transparent hover:bg-luxury-gold hover:text-white transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Book Reservation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#D0A511]  opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-gray-900 hover:text-luxury-gold transition-colors z-50"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
                    className={`text-2xl font-serif hover:text-luxury-gold transition-colors ${pathname === link.href || (link.name === "Services" && pathname.startsWith("/services")) ? "text-luxury-gold" : "text-gray-900"
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
                className="mt-4"
              >
                <Link
                  href="/booking"
                  className="px-8 py-4 border border-luxury-gold text-base text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 font-semibold"
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
