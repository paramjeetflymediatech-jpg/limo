"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  Wifi, 
  Shield, 
  Wine, 
  Gauge, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Phone, 
  Mail,
  Car,
  Clock
} from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  passengers: number;
  luggage: number;
  available: boolean;
  imagesJson?: string;
  amenitiesJson?: string;
}

interface FleetDetailClientProps {
  car: Vehicle;
}

const AMENITY_METADATA: Record<string, { description: string; icon: any }> = {
  "High-Speed Wi-Fi": { description: "Stay connected in transit", icon: Wifi },
  "Discreet Privacy Glass": { description: "Complete soundproofing & visibility shield", icon: Shield },
  "Premium Audio System": { description: "Bespoke ambient acoustics", icon: Gauge },
  "Chilled Mineral Water": { description: "Complimentary premium refreshments", icon: Wine },
  "Professional Chauffeur": { description: "Uniformed, licensed, NDA‑secured driver", icon: Users },
  "Dual Zone Climate Control": { description: "Personalized cabin temperature", icon: Shield },
};

export default function FleetDetailClient({ car }: FleetDetailClientProps) {
  // Parse gallery images
  let additionalImages: string[] = [];
  try {
    if (car.imagesJson) {
      const parsed = JSON.parse(car.imagesJson);
      if (Array.isArray(parsed)) {
        additionalImages = parsed.filter(img => typeof img === "string" && img.trim() !== "");
      }
    }
  } catch (e) {
    console.error("Failed to parse imagesJson:", e);
  }

  // Combine primary image and additional images to build full gallery
  const gallery = Array.from(new Set([car.image, ...additionalImages]));
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Parse rate to calculate a daily rate estimate
  let hourlyRate = 150;
  try {
    hourlyRate = parseInt(car.price.replace(/[^0-9]/g, "")) || 150;
  } catch (e) {
    // Fallback
  }

  const specs = [
    { label: "Category", value: car.category, icon: Car },
    { label: "Passenger Capacity", value: `${car.passengers} Guests`, icon: Users },
    { label: "Luggage Capacity", value: `${car.luggage} Bags`, icon: Briefcase },
    { label: "Hourly Rate", value: car.price, icon: Clock },
    { label: "Daily Rate (8 hrs)", value: `$${hourlyRate * 8}/day`, icon: Clock },
    { label: "Status", value: car.available ? "Available" : "Booked Out", icon: Shield },
  ];

  // Parse amenities from DB
  let amenities: Array<{ label: string; description: string; icon: any }> = [];
  try {
    if (car.amenitiesJson) {
      const parsed = JSON.parse(car.amenitiesJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        amenities = parsed.map(label => {
          const meta = AMENITY_METADATA[label] || { description: "Premium passenger inclusion", icon: Check };
          return {
            label,
            description: meta.description,
            icon: meta.icon
          };
        });
      }
    }
  } catch (e) {
    console.error("Failed to parse amenitiesJson:", e);
  }

  // Fallback to defaults if no amenities parsed
  if (amenities.length === 0) {
    amenities = [
      { label: "High-Speed Wi-Fi", description: "Stay connected in transit", icon: Wifi },
      { label: "Discreet Privacy Glass", description: "Complete soundproofing & visibility shield", icon: Shield },
      { label: "Premium Audio System", description: "Bespoke ambient acoustics", icon: Gauge },
      { label: "Chilled Mineral Water", description: "Complimentary premium refreshments", icon: Wine },
      { label: "Professional Chauffeur", description: "Uniformed, licensed, NDA‑secured driver", icon: Users },
      { label: "Dual Zone Climate Control", description: "Personalized cabin temperature", icon: Shield },
    ];
  }

  return (
    <div className="bg-matte-black min-h-screen py-12 md:py-20 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="mb-10">
          <Link 
            href="/fleet"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-luxury-gold hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back To Fleet Collection</span>
          </Link>
        </div>

        {/* Vehicle Header (Title & Category) */}
        <div className="mb-12 border-b border-luxury-gold/10 pb-8">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            {car.category}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-wide">
            {car.name}
          </h1>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* LEFT COLUMN: Gallery Viewport & Thumbnails */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Active Display Screen */}
            <div className="relative h-[320px] sm:h-[450px] lg:h-[500px] w-full overflow-hidden rounded-lg border border-luxury-gold/15 bg-charcoal/40 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <Image
                    src={gallery[activeImageIndex]}
                    alt={`${car.name} main image`}
                    fill
                    priority
                    sizes="(max-w-1024px) 100vw, 60vw"
                    className="object-cover brightness-95 hover:scale-105 transition-transform duration-700"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnails Row */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-video rounded overflow-hidden border bg-charcoal/60 transition-all cursor-pointer ${
                      activeImageIndex === idx 
                        ? "border-luxury-gold shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-[1.03]" 
                        : "border-luxury-gold/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${car.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Info, Specs & Booking */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Description & Cost */}
            <div className="glass-panel rounded-xl p-6 md:p-8 flex flex-col gap-6">
              <div className="flex justify-between items-baseline border-b border-luxury-gold/10 pb-4">
                <span className="text-gray-400 text-xs uppercase tracking-widest">Rate (USD)</span>
                <span className="text-3xl font-serif text-luxury-gold font-bold">{car.price}</span>
              </div>
              
              <div className="text-gray-300 text-sm leading-relaxed font-light">
                <h3 className="text-white text-xs uppercase tracking-widest font-semibold mb-2">Description</h3>
                <p>{car.description}</p>
              </div>
            </div>

            {/* Specifications Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {specs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div 
                    key={spec.label} 
                    className="border border-luxury-gold/10 bg-matte-black/40 rounded-lg p-4 flex flex-col gap-1 hover:border-luxury-gold/25 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2 text-luxury-gold mb-1">
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px] uppercase tracking-wider text-gray-500">{spec.label}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">{spec.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Premium Onboard Amenities */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-4 pl-1">
                Luxury Inclusions & Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {amenities.map((amenity) => {
                  const Icon = amenity.icon;
                  return (
                    <div key={amenity.label} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-luxury-gold/5 border border-luxury-gold/10 flex items-center justify-center text-luxury-gold shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white">{amenity.label}</span>
                        <span className="text-[10px] text-gray-500 leading-normal">{amenity.description}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTAs & Support */}
            <div className="flex flex-col gap-4 mt-4">
              <Link
                href={`/booking?vehicle=${encodeURIComponent(car.name)}`}
                className="w-full py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 text-center rounded"
              >
                <span>Reserve {car.name}</span>
              </Link>
              
              <div className="flex flex-col gap-2 text-center text-xs text-gray-500 py-3 border-t border-luxury-gold/10">
                <span className="uppercase tracking-widest text-[9px] text-gray-600">Secure Direct Booking Concierge</span>
                <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 mt-1">
                  <a href="tel:+13062404000" className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors">
                    <Phone className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>+1 (306) 240-4000</span>
                  </a>
                  <a href="mailto:info@fantasticlimo.ca" className="flex items-center gap-1.5 hover:text-luxury-gold transition-colors">
                    <Mail className="w-3.5 h-3.5 text-luxury-gold" />
                    <span>info@fantasticlimo.ca</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
