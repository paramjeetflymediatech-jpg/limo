"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BookingForm from "../BookingForm";

export default function Hero() {
  const [viewMode, setViewMode] = useState<"exterior" | "interior">("exterior");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="   relative min-h-[95vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden pt-12"
    >
      {/* Video Backgrounds */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-black">
        {/* Exterior Video */}
        <div
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${viewMode === "exterior" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full filter brightness-[0.65]"
            poster="/vid1.mp4"
          >
            <source
              src="/vid1.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Interior Video */}
        <div
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${viewMode === "interior" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full scale-105 filter brightness-[0.5] transition-transform duration-1000"
            poster="/images/limo_interior.png"
          >
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-luxury-car-42297-large.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Dark overlays with gold/black gradients for solid text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75 bg-black/40" />
      </div>

      {/* Mouse Follow Glow Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-45 mix-blend-screen transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(208,165,17,0.08), transparent 80%)`,
        }}
      />

      {/* Gold neon top line divider animation */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-luxury-gold/50 to-transparent animate-pulse-slow" />

      {/* Floating Spec Panel for Interior Cabin */}
      <AnimatePresence>
        {viewMode === "interior" && (
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute left-8 bottom-32 hidden xl:flex flex-col gap-4 p-6 glass-panel border border-luxury-gold/30 rounded-lg max-w-xs text-left z-20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <h4 className="text-luxury-gold font-serif font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-luxury-gold animate-ping" />
              VIP Cabin Lounge
            </h4>
            <p className="text-xs text-gray-300 font-light leading-relaxed">
              Step inside the sound-insulated executive rear compartment featuring climate-regulated massage seating and tailored amenities.
            </p>
            <ul className="flex flex-col gap-2 text-[10px] uppercase tracking-widest text-white/90">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                Starlight Headliner
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                Champagne Bar & Glassware
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                Acoustic Privacy Partition
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <div className=" mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10 pt-20 pb-12 lg:pb-24  backdrop-blur-xs">
        {/* Decorative FIFA World Cup Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-red-500/30 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.3em] hero-text-white font-semibold">
            FIFA World Cup 2026 VIP Transfers
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold hero-text-white tracking-tight leading-none mb-6 max-w-5xl"
        >
          Experience The <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-soft-gold to-luxury-gold">Art Of Luxury Travel</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-text-white-muted text-sm md:text-lg uppercase tracking-[0.25em] font-light max-w-2xl mb-10 leading-relaxed"
        >
          Elite Chauffeur & Limousine Services For VIP Clients
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <Link
            href="/booking"
            className="px-8 py-4 bg-luxury-gold hero-text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(208,165,17,0.4)] transition-all duration-300 rounded-sm"
          >
            Reserve Your Ride
          </Link>
          <Link
            href="/fleet"
            className="px-8 py-4 border border-[#ffffff]/35 hover:border-luxury-gold hero-text-white font-semibold text-xs uppercase tracking-widest bg-black/10 backdrop-blur-sm transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(208,165,17,0.1)]"
          >
            Explore Luxury Fleet
          </Link>
        </motion.div>

        {/* FIFA World Cup Event Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-full max-w-4xl mb-10 p-5 rounded-lg border border-red-500 bg-white/95 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.15)] text-left flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/35 flex items-center justify-center text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)] flex-shrink-0 animate-pulse">
              ⚽
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-bold block mb-1">
                Canada 2026 Special Event Chauffeur
              </span>
              <h3 className="text-black text-base md:text-lg font-serif font-bold">
                FIFA World Cup Chauffeur Services
              </h3>
              <p className="text-gray-700 text-xs font-light mt-1">
                Luxury stadium transfers to BMO Field (Toronto) & BC Place (Vancouver). Bypass traffic with VIP stadium drop-offs.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-end">
            <Link
              href="/booking?dropoff=BC+Place,+Vancouver,+BC&vehicle=VIP+Executive+Sprinter"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 hero-text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center flex-1 sm:flex-initial"
            >
              BC Place (Vancouver)
            </Link>
            <Link
              href="/booking?dropoff=BMO+Field,+Toronto,+ON&vehicle=VIP+Executive+Sprinter"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 hero-text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center flex-1 sm:flex-initial"
            >
              BMO Field (Toronto)
            </Link>
          </div>
        </motion.div>

        {/* Floating Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full max-w-7xl mt-6"
        >
          <BookingForm horizontal={true} />
        </motion.div>
      </div>
    </section>
  );
}
