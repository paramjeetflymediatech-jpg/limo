"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  id: number;
  name: string;
  slug: string;
}

const staticNavLinks = [
  { name: "Home", href: "/" },
  { name: "Fleet", href: "/fleet" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
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

  // Fetch services dynamically from DB
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data: ServiceItem[]) => {
        console.log(data,'data')
        if (Array.isArray(data)) {
          setServices(data);
        }
      })
      .catch(() => {
        // Fallback: keep empty, Services link still works
      });
  }, []);

  // Build nav links with dynamic services dropdown
  const navLinks = [
    staticNavLinks[0], // Home
    staticNavLinks[1], // Fleet
    {
      name: "Services",
      href: "/services",
      dropdown:
        services.length > 0
          ? services.map((s) => ({
              name: s.name,
              href: `/services/${s.slug || s.id}`,
            }))
          : undefined,
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
              FANTASTICLIMO
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold -mt-1 font-semibold">
              LUXURY CHAUFFEUR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link: any) => {
              if (link.dropdown && link.dropdown.length > 0) {
                return (
                  <div
                    key={link.name}
                    className="relative group"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-1 text-sm uppercase tracking-widest hover:text-luxury-gold transition-colors py-2 ${
                        pathname === link.href || pathname.startsWith("/services")
                          ? "text-luxury-gold"
                          : "text-gray-800"
                      }`}
                    >
                      {link.name}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </Link>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-0 mt-1 w-64 bg-white border border-gray-100 rounded-md py-2 shadow-xl"
                        >
                          {link.dropdown.map((subLink:any) => (
                            <Link
                              key={subLink.name}
                              href={subLink.href}
                              className={`block px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-white transition-colors ${
                                pathname === subLink.href
                                  ? "text-luxury-gold"
                                  : "text-gray-800"
                              }`}
                            >
                              {subLink.name}
                            </Link>
                          ))}
                          {/* View all services link */}
                          <div className="border-t border-luxury-gold/10 mt-1 pt-1">
                            <Link
                              href="/services"
                              className="block px-4 py-2 text-xs uppercase tracking-widest text-luxury-gold/60 hover:text-luxury-gold transition-colors"
                            >
                              View All Services →
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              // Services with no dropdown yet (loading state) - show as plain link
              if (link.name === "Services") {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm uppercase tracking-widest hover:text-luxury-gold transition-colors relative py-2 ${
                      pathname === link.href || pathname.startsWith("/services")
                        ? "text-luxury-gold"
                        : "text-gray-800"
                    }`}
                  >
                    {link.name}
                    {(pathname === link.href || pathname.startsWith("/services")) && (
                      <motion.span
                        layoutId="navActiveLine"
                        className="absolute bottom-0 left-0 w-full h-[1px] bg-luxury-gold"
                      />
                    )}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm uppercase tracking-widest hover:text-luxury-gold transition-colors relative py-2 ${
                    pathname === link.href ? "text-luxury-gold" : "text-gray-800"
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
              className="relative inline-flex items-center justify-center px-6 py-3 border border-luxury-gold/50 hover:border-luxury-gold text-xs uppercase tracking-widest font-semibold text-gray-900 bg-transparent hover:bg-luxury-gold hover:text-white transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10">Book Reservation</span>
              <span className="absolute inset-0 bg-gradient-to-r from-luxury-gold to-soft-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0" />
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
                  {link.dropdown && link.dropdown.length > 0 ? (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-gray-500 text-xs uppercase tracking-widest mb-1">
                        {link.name}
                      </span>
                      {link.dropdown.map((subLink:any) => (
                        <Link
                          key={subLink.name}
                          href={subLink.href}
                          className={`text-lg font-serif my-0.5 block hover:text-luxury-gold transition-colors ${
                            pathname === subLink.href ? "text-luxury-gold" : "text-gray-900"
                          }`}
                        >
                          {subLink.name}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        className="text-xs uppercase tracking-widest text-luxury-gold/60 hover:text-luxury-gold transition-colors mt-1"
                      >
                        View All →
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-2xl font-serif hover:text-luxury-gold transition-colors ${
                        pathname === link.href ? "text-luxury-gold" : "text-gray-900"
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
                transition={{ delay: navLinks.length * 0.08 }}
                className="mt-4"
              >
                <Link
                  href="/booking"
                  className="px-8 py-4 border border-luxury-gold text-sm uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-300 font-semibold"
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
