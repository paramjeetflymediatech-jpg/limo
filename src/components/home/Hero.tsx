"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BookingForm from "../BookingForm";

export default function Hero() {
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
      className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-center items-center overflow-hidden pt-12"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full scale-105 filter brightness-50 transition-transform duration-1000"
          poster="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1920"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-luxury-black-car-driving-through-the-city-at-night-42295-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlays with gold tint gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-transparent to-matte-black/80" />
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

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-8xl font-serif font-bold text-white tracking-tight leading-none mb-6 max-w-5xl"
        >
          Experience The <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-gold via-champagne-gold to-luxury-gold">Art Of Luxury Travel</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-gray-300 text-sm md:text-lg uppercase tracking-[0.25em] font-light max-w-2xl mb-10 leading-relaxed"
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
            className="px-8 py-4 border border-white/20 hover:border-luxury-gold text-white font-semibold text-xs uppercase tracking-widest bg-matte-black/20 backdrop-blur-sm transition-all duration-300 rounded-sm hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]"
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
