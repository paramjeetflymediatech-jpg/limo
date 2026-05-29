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
  const itemsPerPage = 4;

  const totalItems = services.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = services.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
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
            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {paginatedServices.map((service, index) => (
                  <div
                    key={service.id}
                    onClick={() => router.push(`/services/${service.slug}`)}
                    className="glass-panel rounded-xl overflow-hidden border border-luxury-gold/10 hover:border-luxury-gold/30 hover:bg-matte-black/60 transition-all duration-300 group flex flex-col justify-between h-full cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Banner */}
                    <div className="relative h-64 md:h-72 bg-matte-black overflow-hidden border-b border-luxury-gold/10">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-95"
                      />

                      {service.price && (
                        <div className="absolute bottom-4 right-4 bg-luxury-gold text-matte-black font-bold text-xs px-3.5 py-1 rounded-full shadow-lg flex items-center gap-0.5">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>{service.price.replace("$", "")}</span>
                        </div>
                      )}
                    </div>

                    {/* Details Box */}
                    <div className="p-8 md:p-10 flex-grow flex flex-col justify-between gap-6">
                      <div>
                        <h2 className="text-2xl font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-300 font-bold">
                          {service.name}
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed font-light line-clamp-3">
                          {service.description.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ")}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-luxury-gold/10 pt-6 mt-4">
                        <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-luxury-gold fill-luxury-gold" />
                          Bespoke Protocol Included
                        </span>
                        <Link
                          href={`/booking?service=${encodeURIComponent(service.name)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs uppercase tracking-widest text-luxury-gold  font-bold flex items-center gap-2 transition-colors duration-300"
                        >
                          <span>Reserve Service</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
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
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-luxury-gold/10 text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-luxury-gold/10 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 flex items-center justify-center border text-xs font-semibold rounded transition-all cursor-pointer ${currentPage === page
                        ? "bg-luxury-gold border-luxury-gold text-matte-black font-bold shadow-[0_0_15px_rgba(208,165,17,0.2)]"
                        : "border-luxury-gold/10 text-gray-400 hover:text-white hover:border-luxury-gold/30 hover:bg-luxury-gold/5"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
