"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { services } from "@/components/home/Services";

export default function ServicesPage() {
  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-80 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Capabilities
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Luxury Mobility Redefined
          </h1>
          <p className="text-white text-sm md:text-base font-light leading-relaxed">
            From single airport transfers to global diplomatic roadshows, FantasticLimo offers bespoke transportation services calibrated to absolute perfection.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel p-8 md:p-12 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 hover:bg-matte-black/60 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-8 border border-luxury-gold/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                    {service.title}
                  </h2>
                  <p className="text-white/95 text-sm leading-relaxed font-light mb-8">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-luxury-gold/10 pt-6">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
                    Bespoke Protocol Included
                  </span>
                  <Link
                    href={service.href}
                    className="text-xs uppercase tracking-widest text-luxury-gold group-hover:text-white font-semibold flex items-center gap-2 transition-colors duration-300"
                  >
                    <span>Request Details</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Logistics Section */}
        <div className="glass-panel p-8 md:p-16 rounded-xl border border-luxury-gold/15 relative overflow-hidden text-center max-w-4xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold mb-4 block">
            Complex Logistics
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4">
            Need a Customized Itinerary?
          </h2>
          <p className="text-gray-300 text-sm font-light leading-relaxed max-w-2xl mx-auto mb-8">
            For multi-city corporate meetings, luxury tours, embassy support, or high-profile weddings, our VIP coordinator is at your service to engineer every waypoint.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-4 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-matte-black text-xs uppercase tracking-widest font-semibold transition-all duration-300"
          >
            Contact VIP Coordinator
          </Link>
        </div>
      </div>
    </div>
  );
}
