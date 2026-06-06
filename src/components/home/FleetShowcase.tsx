"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export const fleetItems = [
  {
    id: "rolls-royce",
    name: "Rolls-Royce Phantom VIII",
    category: "Ultra Luxury Sedan",
    image: "https://images.unsplash.com/photo-1631214548472-ee198c69dc67?auto=format&fit=crop&q=80&w=800",
    description: "The ultimate signature of luxury and prestige. Offers a whisper-quiet ride and hand-crafted leather interior.",
    price: "$350/hr",
    passengers: 4,
    luggage: 3,
    imagesJson: '["/images/luxury_rolls_interior.png","https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=800"]',
  },
  {
    id: "mercedes-s",
    name: "Mercedes-Benz S-Class (W223)",
    category: "Executive Sedan",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    description: "The gold standard in executive business transport. Features active ambient lighting and rear reclining seats.",
    price: "$150/hr",
    passengers: 3,
    luggage: 2,
    imagesJson: '["https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&q=80&w=800"]',
  },
  {
    id: "bentley-spur",
    name: "Bentley Flying Spur",
    category: "Ultra Luxury Sedan",
    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800",
    description: "A perfect blend of high-performance driving dynamics and hand-crafted British luxury craftsmanship.",
    price: "$280/hr",
    passengers: 4,
    luggage: 3,
    imagesJson: '["/images/limo_interior.png","https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"]',
  },
  {
    id: "cadillac-escalade",
    name: "Cadillac Escalade ESV",
    category: "Luxury SUV",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
    description: "Bold styling, incredible road presence, and vast cargo capacity. Perfect for group airport transfers.",
    price: "$180/hr",
    passengers: 6,
    luggage: 6,
    imagesJson: '["/images/luxury_limo_lounge.png","https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800"]',
  },
  {
    id: "stretch-limo",
    name: "Super Stretch Limousine",
    category: "Limo",
    image: "https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=800",
    description: "Classic stretch styling with modern light bar, fiber optics, sound system, and privacy partition.",
    price: "$220/hr",
    passengers: 10,
    luggage: 5,
    imagesJson: '["/images/limo_interior.png","/images/luxury_limo_lounge.png"]',
  },
  {
    id: "vip-sprinter",
    name: "VIP Executive Sprinter",
    category: "Luxury Coach",
    image: "https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?auto=format&fit=crop&q=80&w=800",
    description: "High-roof configuration with face-to-face leather captain chairs, LED ceiling panels, and premium bar.",
    price: "$250/hr",
    passengers: 12,
    luggage: 10,
    imagesJson: '["/images/luxury_limo_lounge.png","/images/private_jet_interior.png"]',
  },
];

interface ShowcaseFleetItem {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  price: string;
  passengers: number;
  luggage: number;
  available?: boolean;
  imagesJson?: string;
}

function VehicleCard({ car, index }: { car: ShowcaseFleetItem; index: number }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Parse gallery images
  let gallery: string[] = [];
  try {
    if (car.imagesJson) {
      gallery = JSON.parse(car.imagesJson);
    }
  } catch (e) {
    console.error("Error parsing imagesJson:", e);
  }

  // Combine primary image and gallery
  const images = [car.image, ...gallery].filter(Boolean);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="bg-white rounded-xl overflow-hidden group border border-gray-200/80 hover:border-luxury-gold/50 hover:shadow-[0_10px_35px_rgba(208,165,17,0.18)] transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col h-full"
    >
      {/* Image Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white block group/image">
        <Link href={`/fleet/${car.id}`} className="absolute inset-0 w-full h-full block">
          <Image
            src={images[currentImgIndex]}
            alt={`${car.name} - View ${currentImgIndex + 1}`}
            fill
            sizes="(max-width: 728px) 100vw, 33vw"
            className="object-contain group-hover:scale-105 transition-transform duration-700"
          />
        </Link>

        {/* Category Tag */}
        <div className="absolute top-4 left-4 bg-matte-black/85 backdrop-blur-md px-3 py-1 border border-luxury-gold/25 text-[10px] uppercase tracking-widest text-luxury-gold rounded-full z-20 pointer-events-none">
          {car.category}
        </div>

        {/* Arrow Navigation (only shown if there are multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 border border-white/10 text-white flex items-center justify-center z-20 cursor-pointer md:opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:scale-105 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 border border-white/10 text-white flex items-center justify-center z-20 cursor-pointer md:opacity-0 group-hover/image:opacity-100 transition-all duration-300 hover:scale-105 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-none">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentImgIndex
                      ? "w-4 bg-luxury-gold"
                      : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details */}
      <div className="p-6 md:p-8 flex flex-col justify-between flex-grow bg-white">
        <div>
          <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-luxury-gold transition-colors duration-300 font-bold">
            <Link href={`/fleet/${car.id}`}>{car.name}</Link>
          </h3>
          <div className="flex gap-6 border-t border-gray-100 pt-4 mb-6 text-[11px] uppercase tracking-widest text-gray-500 font-medium">
            <span>
              Passengers: <strong className="text-gray-800">{car.passengers}</strong>
            </span>
            <span>
              Luggage: <strong className="text-gray-800">{car.luggage}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto border-t border-gray-100 pt-4">
          <Link
            href={`/fleet/${car.id}`}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-800 hover:text-luxury-gold font-bold group/link transition-colors duration-300"
          >
            <span>Explore</span>
            <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </Link>
          <Link
            href={`/booking?vehicle=${encodeURIComponent(car.name)}`}
            className="text-xs uppercase tracking-widest text-gray-800 hover:text-luxury-gold font-bold transition-colors duration-300"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FleetShowcase({ fleet }: { fleet?: ShowcaseFleetItem[] }) {
  const displayFleet =
    fleet && fleet.length > 0
      ? fleet.filter((car) => car.available !== false).slice(0, 6)
      : fleetItems;

  return (
    <section className="bg-[#EDE7DB] py-24 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D0A511] font-black mb-3 block">
            The FantasticLimo Fleet
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
            Pinnacle of Automotive Prestige
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed font-light">
            Our meticulously curated fleet offers the finest in comfort, state-of-the-art technology, and absolute
            privacy. Discover the ultimate travel companion.
          </p>
        </div>

        {/* Grid of Vehicles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFleet.map((car, index) => (
            <VehicleCard key={car.id} car={car} index={index} />
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-16">
          <Link
            href="/fleet"
            className="inline-flex px-8 py-4 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold hover:text-white hover:bg-luxury-gold text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-[0_0_10px_rgba(208,165,17,0.05)]"
          >
            View Entire Fleet
          </Link>
        </div>
      </div>
    </section>
  );
}

