"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Force the window to scroll to top immediately
    window.scrollTo(0, 0);
    
    // 2. Disable default browser scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 3. Lock the body so the user cannot scroll while the preloader is active
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Re-enable scrolling after the preloader finishes
      document.body.style.overflow = 'auto';
    }, 3200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%", filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-matte-black flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-gold/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Center Container for Masked Reveal */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* Top Text (Masked Reveal Up) */}
            <div className="overflow-hidden mb-3">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-[0.2em] text-white"
              >
                FANTASTIC<span className="text-luxury-gold italic font-light">LIMO</span>
              </motion.h1>
            </div>

            {/* Center Animated Line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "120%", opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
              className="h-[1px] bg-gradient-to-r from-transparent via-luxury-gold to-transparent w-64 md:w-96 relative shadow-[0_0_15px_rgba(208,165,17,0.8)]"
            >
              {/* Traveling light spec */}
              <motion.div 
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] bg-white blur-[1px]"
              />
            </motion.div>

            {/* Bottom Text (Masked Reveal Down) */}
            <div className="overflow-hidden mt-4">
              <motion.p
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.8 }}
                className="text-[9px] md:text-[11px] uppercase tracking-[0.5em] text-gray-400 font-semibold"
              >
                Where Every Ride Is An Experience
              </motion.p>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
