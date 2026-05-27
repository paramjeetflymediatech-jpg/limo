"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Star } from "lucide-react";

interface LocationService {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  price: string;
  available: boolean;
}

interface ServicesProps {
  services: LocationService[];
}

export default function Services({ services }: ServicesProps) {
  // If there are no services, show a fallback message
  if (!services || services.length === 0) {
    return null;
  }

  // Display only the first 8 active services on the home page for clean layout
  const displayedServices = services.slice(0, 8);

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
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-white font-semibold transition-colors duration-300 shrink-0"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass-panel rounded-lg overflow-hidden border border-luxury-gold/10 hover:border-luxury-gold/30 hover:shadow-[0_0_25px_rgba(212,175,55,0.1)] hover:bg-dark-gray/40 transition-all duration-300 flex flex-col justify-between h-full group"
            >
              {/* Card Thumbnail Image */}
              <div className="relative h-44 bg-matte-black overflow-hidden border-b border-luxury-gold/10 shrink-0">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.8] group-hover:brightness-95"
                />
                <div className="absolute top-3 left-3 bg-matte-black/80 backdrop-blur-sm px-2.5 py-0.5 border border-luxury-gold/25 rounded-full text-[9px] uppercase tracking-widest text-luxury-gold font-bold flex items-center gap-1">
                  <MapPin className="w-2.5 h-2.5 text-luxury-gold" />
                  <span>{service.location}</span>
                </div>
                {service.price && (
                  <div className="absolute top-3 right-3 bg-luxury-gold text-matte-black font-bold text-[10px] px-2 py-0.5 rounded shadow">
                    {service.price}
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-md font-serif text-white mb-2 group-hover:text-luxury-gold transition-colors duration-300 font-bold">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-light line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-luxury-gold/5 pt-4 mt-auto">
                  <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-luxury-gold fill-luxury-gold" />
                    Bespoke Chauffeur
                  </span>
                  <Link
                    href={`/booking?service=${encodeURIComponent(service.name)}&location=${encodeURIComponent(service.location)}`}
                    className="text-[10px] uppercase tracking-widest text-luxury-gold  font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>Reserve</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
