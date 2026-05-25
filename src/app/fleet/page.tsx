"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, Briefcase, Wifi, Shield, Wine, Gauge, ArrowRight } from "lucide-react";
import { fleetItems } from "@/components/home/FleetShowcase";

const detailedFleet = fleetItems.map((car, idx) => {
  const specs = [
    { label: "Category", value: car.category },
    { label: "Pax Capacity", value: `${car.passengers} Guests` },
    { label: "Luggage", value: `${car.luggage} Bags` },
    { label: "Hourly Rate", value: car.price },
    { label: "Daily Rate", value: `$${parseInt(car.price.replace(/[^0-9]/g, "")) * 8}/day` },
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

export default function FleetPage() {
  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
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
          {detailedFleet.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Image Showcase */}
              <div className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15 group shadow-2xl">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-w-768px) 100vw, 50vw"
                  priority={index < 2}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100"
                />
                <div className="absolute top-6 left-6 bg-matte-black/80 backdrop-blur-md border border-luxury-gold/20 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest text-luxury-gold font-semibold">
                  {car.category}
                </div>
              </div>

              {/* Specifications & Details */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold/80 mb-2 font-medium">
                  {car.category}
                </span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4">
                  {car.name}
                </h2>
                <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-6">
                  {car.description}
                </p>

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
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs tracking-wider">{amenity.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reservation Action */}
                <Link
                  href={`/booking?vehicle=${encodeURIComponent(car.name)}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 self-start"
                >
                  <span>Reserve {car.name.split(" ")[0]}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
