"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const fleetItems = [
  {
    id: "rolls-royce",
    name: "Rolls-Royce Phantom VIII",
    category: "Ultra Luxury Sedan",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=800",
    description: "The ultimate signature of luxury and prestige. Offers a whisper-quiet ride and hand-crafted leather interior.",
    price: "$350/hr",
    passengers: 4,
    luggage: 3,
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
  },
  {
    id: "stretch-limo",
    name: "Super Stretch Limousine",
    category: "Limo",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    description: "Classic stretch styling with modern light bar, fiber optics, sound system, and privacy partition.",
    price: "$220/hr",
    passengers: 10,
    luggage: 5,
  },
  {
    id: "vip-sprinter",
    name: "VIP Executive Sprinter",
    category: "Luxury Coach",
    image: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800",
    description: "High-roof configuration with face-to-face leather captain chairs, LED ceiling panels, and premium bar.",
    price: "$250/hr",
    passengers: 12,
    luggage: 10,
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
}

export default function FleetShowcase({ fleet }: { fleet?: ShowcaseFleetItem[] }) {
  const displayFleet =
    fleet && fleet.length > 0
      ? fleet.filter((car) => car.available !== false).slice(0, 6)
      : fleetItems;

  return (
    <section className="bg-dark-gray py-24 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            The FantasticLimo Fleet
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Pinnacle of Automotive Prestige
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed font-light">
            Our meticulously curated fleet offers the finest in comfort, state-of-the-art technology, and absolute
            privacy. Discover the ultimate travel companion.
          </p>
        </div>

        {/* Grid — NO perspective, NO 3D, NO onMouseMove */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayFleet.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="glass-panel rounded-lg overflow-hidden group border border-luxury-gold/10 hover:border-luxury-gold/30 hover:shadow-[0_0_30px_rgba(208,165,17,0.15)] transition-all duration-500 shadow-xl flex flex-col h-full"
            >
              {/* Image */}
              <Link href={`/fleet/${car.id}`} className="relative h-64 overflow-hidden bg-matte-black block">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(208,165,17,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 728px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-100"
                />
                <div className="absolute top-4 left-4 bg-matte-black/75 backdrop-blur-md px-3 py-1 border border-luxury-gold/20 text-[10px] uppercase tracking-widest text-luxury-gold rounded-full z-20">
                  {car.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-luxury-gold text-white font-semibold text-xs px-3 py-1.5 rounded-sm tracking-wider z-20 shadow-md">
                  {car.price}
                </div>
              </Link>

              {/* Details */}
              <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
                    <Link href={`/fleet/${car.id}`}>{car.name}</Link>
                  </h3>
                  <p className="text-xs md:text-sm font-light leading-relaxed mb-6">{car.description}</p>
                  <div className="flex gap-6 border-t border-luxury-gold/10 pt-4 mb-6 text-[11px] uppercase tracking-widest text-gray-500">
                    <span>
                      Passengers: <strong className="text-gray-300">{car.passengers}</strong>
                    </span>
                    <span>
                      Luggage: <strong className="text-gray-300">{car.luggage}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto border-t border-luxury-gold/10 pt-4">
                  <Link
                    href={`/fleet/${car.id}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-luxury-gold hover:text-black font-semibold group/link"
                  >
                    <span>Explore</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                  <Link
                    href={`/booking?vehicle=${encodeURIComponent(car.name)}`}
                    className="text-xs uppercase tracking-widest text-luxury-gold hover:text-black font-semibold"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </motion.div>
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
