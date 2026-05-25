"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we already loaded in this session to prevent annoying reload behaviors
    const hasLoaded = sessionStorage.getItem("hasLoaded");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasLoaded", "true");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-matte-black flex flex-col items-center justify-center pointer-events-auto"
        >
          {/* Ambient Glow */}
          <div className="absolute w-72 h-72 bg-luxury-gold/5 rounded-full blur-[100px] animate-pulse-slow" />

          <div className="flex flex-col items-center select-none text-center">
            {/* Logo Mark */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="w-16 h-16 border-2 border-luxury-gold/30 rounded-full flex items-center justify-center mb-6 relative"
            >
              <div className="w-10 h-10 border border-luxury-gold/60 rounded-full flex items-center justify-center">
                <span className="font-serif font-bold text-luxury-gold text-lg">F</span>
              </div>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-r-2 border-transparent border-luxury-gold rounded-full"
              />
            </motion.div>

            {/* Logo Text */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-3xl md:text-4xl font-serif font-bold tracking-widest text-white mb-2"
            >
              FANTASTICLIMO
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-[9px] uppercase tracking-[0.4em] text-luxury-gold font-medium"
            >
              Absolute Luxury Chauffeur
            </motion.p>
          </div>

          {/* Luxury loading bar */}
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-white/10 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
              className="w-full h-full bg-gradient-to-r from-transparent via-luxury-gold to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
