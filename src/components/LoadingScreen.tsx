"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

let hasShownPreloader = false;

export default function LoadingScreen() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (pathname === "/" && !hasShownPreloader) {
      setShouldRender(true);
    } else {
      setIsLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!shouldRender) return;

    // 1. Force the window to scroll to top immediately
    window.scrollTo(0, 0);
    
    // 2. Disable default browser scroll restoration on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 3. Lock the body so the user cannot scroll while the preloader is active
    document.body.style.overflow = 'hidden';

    // 4. Animate progress from 0 to 100
    const startTime = Date.now();
    const duration = 3200; // time it takes to reach 100%

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        requestAnimationFrame(updateProgress);
      }
    };
    
    requestAnimationFrame(updateProgress);

    const timer = setTimeout(() => {
      setIsLoading(false);
      hasShownPreloader = true;
      // Re-enable scrolling after the preloader finishes
      document.body.style.overflow = 'auto';
    }, 4500);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto';
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) return;
    if (progress >= 75) {
      setShowLogo(true);
    }
  }, [progress, shouldRender]);

  if (!isMounted || !shouldRender) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%", filter: "blur(10px)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-matte-black flex flex-col items-center justify-center pointer-events-auto select-none"
        >
          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

          {/* Cinematic Background Lines / Road Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)] pointer-events-none" />

          {/* Logo / Tagline Area */}
          <div className="relative flex flex-col items-center justify-center w-full h-full max-w-4xl px-8">
            
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center text-center animate-fade-in"
                >
                  {/* Subtle gold glow behind logo */}
                  <div className="absolute w-[350px] h-[350px] bg-luxury-gold/10 rounded-full blur-[100px] -z-10 animate-pulse pointer-events-none" />

                  {/* Logo Image */}
                  <div className="relative w-[280px] h-[120px] sm:w-[440px] sm:h-[180px] mb-4">
                    <Image
                      src="/preload.png"
                      alt="Fantastic Limo Logo"
                      fill
                      sizes="(max-width: 640px) 280px, 440px"
                      className="object-contain"
                      style={{ filter: "drop-shadow(0px 3px 10px rgba(0, 0, 0, 0.35))" }}
                      priority
                    />
                  </div>

                  {/* Brand Typography */}
                  <div className="flex flex-col items-center tracking-[0.35em] text-center px-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white tracking-[0.25em] uppercase">
                      Fantastic <span className="text-luxury-gold">Limo</span>
                    </h1>
                    <p className="text-[9px] sm:text-[10px] md:text-xs uppercase text-gray-400 mt-2 font-light tracking-[0.3em]">
                      Where Every Ride Is An Experience
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Road & Driving Car Track Area */}
          <div className="absolute bottom-[28%] left-0 right-0 w-full h-28 pointer-events-none overflow-hidden">
            {/* The Road Line */}
            <div className="absolute bottom-6 left-0 w-full h-[1px] bg-white/10">
              {/* Active Gold Progress Trail */}
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-luxury-gold/45 to-luxury-gold shadow-[0_0_15px_rgba(208,165,17,0.6)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* The Escalade Car container driving across */}
            <motion.div
              className="absolute bottom-6 h-14 sm:h-18 w-44 sm:w-56 z-10"
              style={{
                left: `calc(-250px + (100% + 250px) * ${progress} / 100)`,
              }}
              animate={{
                y: [0, -0.8, 1.2, -0.4, 0.8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.22,
                ease: "easeInOut"
              }}
            >
              <div className="relative w-full h-full">
                {/* The Escalade Side Image */}
                <Image
                  src="/images/cadillac_escalade_side.png"
                  alt="Premium Loading Escalade"
                  fill
                  sizes="(max-width: 640px) 176px, 224px"
                  className="object-contain object-bottom"
                  priority
                />

                {/* Headlight Beam */}
                <div 
                  className="absolute right-[-100px] top-[40%] w-[120px] h-[40px] bg-gradient-to-r from-white/35 via-luxury-gold/15 to-transparent blur-[3px] pointer-events-none origin-left"
                  style={{
                    clipPath: "polygon(0 35%, 100% 0, 100% 100%, 0 65%)"
                  }}
                />

                {/* Taillight Red Glow */}
                <div className="absolute left-[2px] top-[42%] w-2.5 h-2.5 bg-red-600 rounded-full blur-[4px] opacity-90" />

                {/* Golden Underglow */}
                <div className="absolute bottom-[-2px] left-[15%] w-[70%] h-2.5 bg-gradient-to-r from-luxury-gold/40 via-luxury-gold to-luxury-gold/40 rounded-full blur-[5px] opacity-80" />
              </div>
            </motion.div>
          </div>

          {/* Minimal Bottom loading progress */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 w-full max-w-[240px] text-center">
            <span className="text-[9px] tracking-[0.35em] text-gray-500 uppercase font-light">
              Preparing your journey
            </span>
            <div className="flex items-center gap-3">
              <div className="w-28 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-luxury-gold shadow-[0_0_8px_rgba(208,165,17,0.8)] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-luxury-gold tracking-wider font-semibold">
                {progress.toString().padStart(2, '0')}%
              </span>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

