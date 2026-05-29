"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PhoneCall, CalendarCheck } from "lucide-react";

export default function BookingCTA() {
  return (
    <section className="bg-matte-black py-28 relative overflow-hidden">
      {/* Decorative luxury gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[400px] bg-gradient-to-r from-luxury-gold/5 via-soft-gold/15 to-luxury-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-panel p-8 md:p-20 rounded-2xl border border-luxury-gold/20 shadow-[0_0_50px_rgba(208,165,17,0.1)] flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left relative overflow-hidden"
        >
          {/* Subtle line decorations */}
          <div className="absolute top-0 right-0 w-48 h-[1px] bg-gradient-to-r from-transparent to-luxury-gold/50" />
          <div className="absolute bottom-0 left-0 w-48 h-[1px] bg-gradient-to-r from-luxury-gold/50 to-transparent" />

          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
              Bespoke Reservations
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Your Luxury Journey Begins Here
            </h2>
            <p className="text-white text-sm md:text-base font-light leading-relaxed">
              Book your private chauffeur reservation online in under two minutes, or speak with our elite concierge service for complex event logistics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 justify-center z-10">
            <Link
              href="/booking"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-luxury-gold text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(208,165,17,0.3)] transition-all duration-300 w-full sm:w-auto rounded-sm"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Reserve Online</span>
            </Link>
            <a
              href="tel:+1234567890"
              className="flex items-center justify-center gap-2 px-8 py-4 border border-luxury-gold/40 text-luxury-gold hover:text-white hover:border-luxury-gold hover:bg-luxury-gold/10 font-semibold text-xs uppercase tracking-widest transition-all duration-300 w-full sm:w-auto rounded-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Concierge</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
