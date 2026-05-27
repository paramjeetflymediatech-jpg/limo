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
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            viewMode === "exterior" ? "opacity-100" : "opacity-0 pointer-events-none"
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
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            viewMode === "interior" ? "opacity-100" : "opacity-0 pointer-events-none"
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
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.08), transparent 80%)`,
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
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10 pt-20 pb-12 lg:pb-24">
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-luxury-gold/30 px-4 py-1.5 rounded-full bg-matte-black/40 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold">
            First-Class Chauffeur Service
          </span>
        </motion.div>

        {/* View Mode Toggle */}
        {/* <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="flex gap-2 p-1.5 bg-matte-black/75 backdrop-blur-md border border-luxury-gold/25 rounded-full mb-8 z-20"
        >
          <button
            onClick={() => setViewMode("exterior")}
            className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all duration-500 cursor-pointer ${
              viewMode === "exterior"
                ? "bg-luxury-gold text-matte-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                : "text-white hover:text-luxury-gold"
            }`}
          >
            Exterior Cruise
          </button>
          <button
            onClick={() => setViewMode("interior")}
            className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all duration-500 cursor-pointer ${
              viewMode === "interior"
                ? "bg-luxury-gold text-matte-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                : "text-white hover:text-luxury-gold"
            }`}
          >
            VIP Cabin Interior
          </button>
        </motion.div> */}

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
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link
            href="/booking"
            className="px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 rounded-sm"
          >
            Reserve Your Ride
          </Link>
          <Link
            href="/fleet"
            className="px-8 py-4 border border-[#ffffff]/35 hover:border-luxury-gold hero-text-white font-semibold text-xs uppercase tracking-widest bg-black/10 backdrop-blur-sm transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
          >
            Explore Luxury Fleet
          </Link>
        </motion.div>

        {/* Floating Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-full max-w-5xl mt-6"
        >
          <BookingForm horizontal={true} />
        </motion.div>
      </div>
    </section>
  );
}
