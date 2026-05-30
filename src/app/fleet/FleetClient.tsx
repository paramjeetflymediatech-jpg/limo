"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, Wifi, Shield, Wine, Gauge, ArrowRight } from "lucide-react";

interface FleetItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  passengers: number;
  luggage: number;
  available?: boolean;
}

interface FleetClientProps {
  fleet: FleetItem[];
}

export default function FleetClient({ fleet }: FleetClientProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const detailedFleet = fleet.map((car) => {
    // Safely parse rate
    let hourlyRate = 150;
    try {
      hourlyRate = parseInt(car.price.replace(/[^0-9]/g, "")) || 150;
    } catch (e) {
      // Fallback
    }

    const specs = [
      { label: "Category", value: car.category },
      { label: "Pax Capacity", value: `${car.passengers} Guests` },
      { label: "Luggage", value: `${car.luggage} Bags` },
      { label: "Hourly Rate", value: car.price },
      { label: "Daily Rate", value: `$${hourlyRate * 8}/day` },
      { label: "Transmission", value: "Automatic" },
    ];

    const amenities = [
      { label: "High-Speed Wi-Fi", icon: Wifi },
      { label: "Discreet Privacy Glass", icon: Shield },
      { label: "Premium Audio System", icon: Gauge },
      { label: "Chilled Mineral Water", icon: Wine },
    ];

    return { ...car, specs, amenities };
  });

  const totalItems = detailedFleet.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFleet = detailedFleet.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-white min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Executive Fleet
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            The Pinnacle Collection
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Every vehicle in our prestige fleet is selected for its engineering perfection, exquisite refinement, and safety parameters. Managed to impeccable standards.
          </p>
        </div>

        {/* Detailed Vehicles List */}
        <div className="flex flex-col gap-20">
          {totalItems === 0 ? (
            <div className="text-center py-20 border border-dashed border-luxury-gold/20 rounded-lg">
              <p className="text-gray-400 text-sm uppercase tracking-widest">No vehicles currently active in the fleet.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-20">
                <AnimatePresence>
                  {paginatedFleet.map((car, index) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -40 }}
                      transition={{ duration: 0.6 }}
                      className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                        }`}
                    >
                      {/* Image Showcase */}
                      <Link
                        href={`/fleet/${car.id}`}
                        className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg  group  bg-white block cursor-pointer"
                      >
                        <Image
                          src={car.image}
                          alt={car.name}
                          fill
                          sizes="(max-w-768px) 100vw, 50vw"
                          priority={currentPage === 1 && index < 2}
                          className="object-contain group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100"
                        />
                        <div className="absolute top-6 left-6 bg-matte-black/80 backdrop-blur-md border border-luxury-gold/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                          {car.category}
                        </div>
                      </Link>

                      {/* Specifications & Details */}
                      <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold/80 mb-2 font-medium">
                          {car.category}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4">
                          <Link href={`/fleet/${car.id}`} className="hover:text-luxury-gold transition-colors duration-300">
                            {car.name}
                          </Link>
                        </h2>
                        {/* <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-6">
                          {car.description}
                        </p> */}

                        {/* Specs Table */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-b border-luxury-gold/10 py-6 mb-6">
                          {car.specs.map((spec) => (
                            <div key={spec.label} className="flex flex-col">
                              <span className="text-[10px] uppercase text-gray-500 tracking-wider mb-1">
                                {spec.label}
                              </span>
                              <span className="text-xs md:text-sm font-semibold text-white">
                                {spec.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Amenities Grid */}
                        <div className="mb-8">
                          <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-4">
                            Onboard Amenities
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {car.amenities.map((amenity) => {
                              const Icon = amenity.icon;
                              return (
                                <div key={amenity.label} className="flex items-center gap-3 text-gray-400">
                                  <div className="w-8 h-8 rounded-full bg-luxury-gold/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/10">
                                    <Icon className="w-4.5 h-4.5" />
                                  </div>
                                  <span className="text-xs tracking-wider">{amenity.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Reservation Action */}
                        <div className="flex flex-wrap gap-4 items-center">
                          <Link
                            href={`/fleet/${car.id}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-luxury-gold text-white font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(208,165,17,0.2)] transition-all duration-300"
                          >
                            <span>Explore Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/booking?vehicle=${encodeURIComponent(car.name)}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold hover:text-luxury-goldfont-semibold text-xs uppercase tracking-widest transition-all duration-300"
                          >
                            <span>Book Now</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-4 border-t border-luxury-gold/10 pt-10 mt-12">
                  <span className="text-xs text-gray-500 font-light tracking-wider">
                    Showing <span className="text-white font-medium">{startIndex + 1}</span>–
                    <span className="text-white font-medium">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
                    <span className="text-white font-medium">{totalItems}</span> elite vehicles
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(p - 1, 1));
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-luxury-gold/10 text-luxury-gold hover:border-luxury-gold/30 hover:bg-luxury-gold/5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:border-luxury-gold/10 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer rounded"
                    >
                      Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                        className={`w-9 h-9 flex items-center justify-center border text-xs font-semibold rounded transition-all cursor-pointer ${currentPage === page
                            ? "bg-luxury-gold border-luxury-gold text-matte-black font-bold shadow-[0_0_15px_rgba(208,165,17,0.2)]"
                            : "border-luxury-gold/10 text-gray-400 hover:text-white hover:border-luxury-gold/30 hover:bg-luxury-gold/5"
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(p + 1, totalPages));
                        window.scrollTo({ top: 400, behavior: "smooth" });
                      }}
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
        </div>
      </div>
    </div>
  );
}
