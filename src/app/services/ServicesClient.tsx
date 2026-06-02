"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Star, MapPin, DollarSign } from "lucide-react";

interface LocationService {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  price: string;
  available: boolean;
  slug: string;
}

interface ServicesClientProps {
  services: LocationService[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const router = useRouter();
  // We will display all services in an elegant scrolling layout
  const totalItems = services.length;

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-80 bg-luxury-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Capabilities
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 animate-fade-in">
            Luxury Mobility Redefined
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed">
            From single airport transfers to global diplomatic roadshows, FantasticLimo offers bespoke transportation services calibrated to absolute perfection across elite locations.
          </p>
        </div>

        {/* Services Catalog */}
        {services.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-luxury-gold/20 rounded-lg max-w-2xl mx-auto">
            <p className="text-gray-400 text-sm uppercase tracking-widest">
              No services currently available.
            </p>
          </div>
        ) : (
          <>
            {/* Services Alternating Layout */}
            <div className="flex flex-col gap-24 mb-24 mt-16">
              {services.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    key={service.id}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20`}
                  >
                    {/* Image Side */}
                    <div className="w-full lg:w-1/2">
                      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden group border border-luxury-gold/10 shadow-2xl">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-matte-black/80 backdrop-blur-md px-4 py-2 border border-luxury-gold/20">
                          <span className="text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                            {service.location || 'Global Coverage'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-semibold mb-4 flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 fill-luxury-gold text-luxury-gold" />
                        Premium Offering
                      </span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                        {service.name}
                      </h2>
                      
                      {/* Render full rich text from admin with clamping */}
                      <div 
                        className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-10 space-y-4 line-clamp-6 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul>li]:mb-2 [&>h1]:text-2xl [&>h1]:font-serif [&>h1]:text-white [&>h1]:mb-3 [&>h2]:text-xl [&>h2]:font-serif [&>h2]:text-white [&>h2]:mb-3 [&>strong]:text-luxury-gold"
                        dangerouslySetInnerHTML={{ __html: service.description }}
                      />
                      
                      <div className="flex flex-wrap items-center gap-6">
                        <Link
                          href={`/booking?service=${encodeURIComponent(service.name)}`}
                          className="px-8 py-4 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold hover:bg-white transition-colors duration-300 flex items-center gap-2 group"
                        >
                          Reserve Now
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        
                        <Link
                          href={`/services/${service.slug}`}
                          className="px-8 py-4 border border-luxury-gold/30 text-luxury-gold text-xs uppercase tracking-widest font-bold hover:border-luxury-gold hover:bg-luxury-gold/5 transition-colors duration-300"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Global Logistics Section */}
        <div className="glass-panel p-8 md:p-16 rounded-xl border border-luxury-gold/15 relative overflow-hidden text-center max-w-4xl mx-auto mt-24">
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
