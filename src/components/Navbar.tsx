"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Fleet", href: "/fleet" },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Airport Transfers", href: "/services/airport-transfers" },
      { name: "Corporate Travel", href: "/services/corporate-travel" },
      { name: "Wedding Chauffeur", href: "/services/wedding-chauffeur" },
    ],
  },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${
          isScrolled
            ? "glass-panel py-4 shadow-lg border-b border-luxury-gold/10"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start tracking-widest group">
            <span className="text-xl md:text-2xl font-serif font-bold text-white group-hover:text-luxury-gold transition-colors duration-300">
              FANTASTICLIMO
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold/80 -mt-1">
              LUXURY CHAUFFEUR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm uppercase tracking-widest text-gray-300 hover:text-luxury-gold transition-colors py-2">
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-1 w-56 glass-panel border border-luxury-gold/20 rounded-md py-2 shadow-xl"
                        >
                          {link.dropdown.map((subLink) => (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              className={`block px-4 py-2 text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-matte-black transition-colors ${
                                pathname === subLink.href
                                  ? "text-luxury-gold"
                                  : "text-gray-300"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase tracking-widest hover:text-luxury-gold transition-colors relative py-2 ${
                    pathname === link.href ? "text-luxury-gold" : "text-gray-300"
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="navActiveLine"
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Booking CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/booking"
              className="relative inline-flex items-center justify-center px-6 py-3 border border-luxury-gold/50 hover:border-luxury-gold text-xs uppercase tracking-widest font-semibold text-white bg-transparent hover:bg-luxury-gold hover:text-matte-black transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Book Reservation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-soft-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white hover:text-luxury-gold transition-colors z-50"
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
            className="fixed inset-0 z-30 bg-matte-black/95 backdrop-blur-md flex flex-col justify-center items-center"
          >
            <div className="flex flex-col items-center gap-8 text-center">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {link.dropdown ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-500 text-xs uppercase tracking-widest">
                        {link.name}
                      </span>
                      {link.dropdown.map((subLink) => (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          className={`text-xl font-serif my-1 block hover:text-luxury-gold transition-colors ${
                            pathname === subLink.href
                              ? "text-luxury-gold"
                              : "text-white"
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-2xl font-serif hover:text-luxury-gold transition-colors ${
                        pathname === link.href ? "text-luxury-gold" : "text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="mt-6"
              >
                <Link
                  href="/booking"
                  className="px-8 py-4 border border-luxury-gold text-sm uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold hover:text-matte-black transition-all duration-300 font-semibold"
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
