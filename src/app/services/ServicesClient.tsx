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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Custom sort order for services as requested
  const getSortIndex = (name: string): number => {
    const normalized = name.toLowerCase();
    if (normalized.includes("private jet")) return 9;
    if (normalized.includes("airport") || normalized.includes("meet") || normalized.includes("transfer")) return 0;
    if (normalized.includes("corporate") || normalized.includes("roadshow")) return 1;
    if (normalized.includes("whistler")) return 2;
    if (normalized.includes("seattle")) return 3;
    if (normalized.includes("hourly") || normalized.includes("charter")) return 4;
    if (normalized.includes("city") || normalized.includes("tour") || normalized.includes("manhattan")) return 5;
    if (normalized.includes("cruise") || normalized.includes("port") || normalized.includes("terminal")) return 8;
    if (normalized.includes("event")) return 6;
    if (normalized.includes("wedding") || normalized.includes("royalty") || normalized.includes("protocol")) return 7;
    return 100;
  };

  const sortedServices = [...services].sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

  const totalItems = sortedServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);

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
              {paginatedServices.map((service, index) => {
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
                      <div className="relative w-full aspect-[4/3] rounded-sm overflow-hidden group ">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105 brightness-[0.85] group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 border border-white/5 pointer-events-none" />
                        {/* <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-matte-black/80 backdrop-blur-md px-4 py-2 border border-luxury-gold/20">
                          <span className="text-white text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-luxury-gold" />
                            {service.location || 'Global Coverage'}
                          </span>
                        </div> */}
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
                          className="px-8 py-4 bg-luxury-gold text-matte-black text-xs uppercase tracking-widest font-bold hover:bg-luxury-gold transition-colors duration-300 flex items-center gap-2 group"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 border-t border-luxury-gold/10 pt-10 mt-12 max-w-4xl mx-auto">
                <span className="text-xs text-gray-500 font-light tracking-wider">
                  Showing <span className="text-white font-medium">{startIndex + 1}</span>–
                  <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
                  <span className="text-white font-medium">{totalItems}</span> bespoke services
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setCurrentPage((p) => Math.max(p - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-luxury-gold/10 text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-luxury-gold/10 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-9 h-9 flex items-center justify-center border text-xs font-semibold rounded transition-all cursor-pointer ${currentPage === page
                        ? "bg-luxury-gold border-luxury-gold text-matte-black font-bold shadow-[0_0_15px_rgba(208,165,17,0.2)]"
                        : "border-luxury-gold/10 text-gray-400 hover:text-white hover:border-luxury-gold/30 hover:bg-luxury-gold/5"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => { setCurrentPage((p) => Math.min(p + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-luxury-gold/10 text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-luxury-gold/10 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
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
