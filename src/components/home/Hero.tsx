"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import BookingForm from "../BookingForm";

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
 
  // Cache safety check: If video is already loaded from cache before event listeners mount
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

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
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          className={`object-cover w-full h-full filter brightness-[0.6] contrast-[1.05] transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          poster="/images/hero/sea_to_sky.png"
        >
          <source src="/vid3.mp4" type="video/mp4" />
        </video>

        {/* Fallback poster background shown while the large video buffers */}
        {!videoLoaded && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center filter brightness-[0.6] contrast-[1.05]"
            style={{ backgroundImage: "url('/images/hero/sea_to_sky.png')" }}
          />
        )}

        {/* Location Indicator Overlay */}
        <div className="absolute top-28 right-8 z-20 hidden md:flex items-center gap-3 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-md border border-white/10 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/90 font-bold">
            Sea-to-Sky Highway
          </span>
        </div>

        {/* Dark overlays with gold/black gradients for solid text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/80 pointer-events-none" />
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

      {/* Hero Content */}
      <div className="mx-auto px-6 md:px-12 w-full flex flex-col items-center text-center relative z-10 pt-20 pb-12 lg:pb-24">
        {/* Decorative FIFA World Cup Badge */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-red-500/30 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] uppercase tracking-[0.3em] hero-text-white font-semibold">
            FIFA World Cup 2026 VIP Transfers
          </span>
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
                USA & Canada 2026 Special Event Chauffeur
              </span>
              <h3 className="text-black text-base md:text-lg font-serif font-bold">
                FIFA World Cup Chauffeur Services
              </h3>
              <p className="text-gray-700 text-xs font-light mt-1">
                Luxury stadium transfers to Lumen Field (Seattle) & BC Place (Vancouver). Bypass traffic with VIP stadium drop-offs.
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
              href="/booking?dropoff=Lumen+Field,+Seattle,+WA&vehicle=VIP+Executive+Sprinter"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 hero-text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center flex-1 sm:flex-initial"
            >
              Lumen Field (Seattle)
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
