"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Plane, Building2, Heart, Shield, Star, Compass, Milestone, ArrowRight } from "lucide-react";

export const services = [
  {
    icon: Plane,
    title: "Airport Transfers",
    description: "Flawless transitions from runway to final destination. Flight tracking and meet-and-greet included.",
    href: "/services/airport-transfers",
  },
  {
    icon: Milestone,
    title: "Corporate Chauffeur",
    description: "A mobile office experience for busy executives. Rely on absolute punctuality and complete confidentiality.",
    href: "/services/corporate-travel",
  },
  {
    icon: Heart,
    title: "Wedding Luxury Cars",
    description: "Make your special day timeless. Meticulously detailed vehicles, professional chauffeurs, and customized ribbons.",
    href: "/services/wedding-chauffeur",
  },
  {
    icon: Star,
    title: "VIP Event Transport",
    description: "Arrive in red carpet style. Tailored group logistical support for galas, award shows, and VIP parties.",
    href: "/services",
  },
  {
    icon: Building2,
    title: "Hotel Transfers",
    description: "Seamless travel between premium five-star resorts, private villas, and corporate offices.",
    href: "/services",
  },
  {
    icon: Compass,
    title: "Celebrity Transport",
    description: "Discreet and premium logistics tailored for public figures, artists, and dignitaries.",
    href: "/services",
  },
  {
    icon: Shield,
    title: "Security Escort Service",
    description: "Close protection and armoring solutions for diplomats, celebrities, and high-net-worth individuals.",
    href: "/services",
  },
];

export default function Services() {
  return (
    <section className="bg-matte-black py-24 relative overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div className="max-w-2xl mb-6 md:mb-0">
            <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
              Our Capabilities
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight">
              Chauffeur Services Tailored to Perfection
            </h2>
          </div>
          <Link
            href="/services"
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-white font-semibold transition-colors duration-300"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="glass-panel p-6 md:p-8 rounded-lg flex flex-col justify-between group hover:border-luxury-gold/30 hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] hover:bg-dark-gray/40 transition-all duration-300 h-full"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-6 border border-luxury-gold/10 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/95 text-xs md:text-sm leading-relaxed font-light mb-6">
                    {service.description}
                  </p>
                </div>

                <Link
                  href={service.href}
                  className="text-xs uppercase tracking-widest text-luxury-gold group-hover:text-white font-semibold flex items-center gap-1.5 mt-auto transition-colors"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
