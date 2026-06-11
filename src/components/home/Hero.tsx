"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import BookingForm from "../BookingForm";

const VIDEOS = [
  {
    src: "/Sea-to-Sky Highway.mp4",
    label: "Sea-to-Sky Highway",
  },
  {
    src: "/Lions-Gate-Bridge.mp4",
    label: "Lions Gate Bridge",
  },
];

const VIDEO_DURATION_MS = 15000; // switch every 15 seconds

export default function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cache safety check: If video is already loaded from cache before event listeners mount
  useEffect(() => {
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

  // Cycle videos on a timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length);
    }, VIDEO_DURATION_MS);
    return () => clearInterval(timer);
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
      className="relative min-h-[95vh] lg:min-h-screen flex flex-col justify-center items-center pt-12"
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden bg-black">

        {/* Render both videos stacked; only the active one is visible */}
        {VIDEOS.map((video, index) => (
          <video
            key={video.src}
            ref={index === 0 ? videoRef : undefined}
            autoPlay
            loop
            muted
            playsInline
            preload={index === 0 ? "auto" : "none"}
            onLoadedData={() => { if (index === 0) setVideoLoaded(true); }}
            onCanPlay={() => { if (index === 0) setVideoLoaded(true); }}
            onError={(e) => console.error(`Hero video ${index} failed to load`, e)}
            className={`absolute inset-0 object-cover w-full h-full filter brightness-[0.6] contrast-[1.05] transition-opacity duration-[1500ms] ${index === activeIndex
                ? videoLoaded || index !== 0
                  ? "opacity-100"
                  : "opacity-0"
                : "opacity-0"
              }`}
            poster={index === 0 ? "/images/hero/sea_to_sky.png" : undefined}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}

        {/* Fallback poster background shown while the first video buffers */}
        {!videoLoaded && activeIndex === 0 && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center filter brightness-[0.6] contrast-[1.05]"
            style={{ backgroundImage: "url('/images/hero/sea_to_sky.png')" }}
          />
        )}

        {/* Location Indicator Overlay */}
        <div className="absolute top-28 right-8 z-20 hidden md:flex items-center gap-3 px-5 py-2.5 bg-black/50 backdrop-blur-md rounded-md border border-white/10 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.span
              key={VIDEOS[activeIndex].label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
              className="text-[10px] uppercase tracking-[0.2em] text-white/90 font-bold"
            >
              {VIDEOS[activeIndex].label}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Video progress dots */}
        <div className="absolute bottom-6 right-8 z-20 hidden md:flex items-center gap-2">
          {VIDEOS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full transition-all duration-500 cursor-pointer ${i === activeIndex
                  ? "w-5 h-1.5 bg-luxury-gold"
                  : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
              aria-label={`Switch to video ${i + 1}`}
            />
          ))}
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
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold hero-text-white tracking-tight leading-none mb-6 max-w-5xl"
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


        {/* Floating Booking Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative w-full max-w-4xl mt-2 transform scale-[0.85] md:scale-[0.8] origin-top overflow-visible"
        >
          <BookingForm horizontal={true} />
        </motion.div>
      </div>
    </section>
  );
}
