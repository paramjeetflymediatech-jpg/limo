"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
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
    const duration = 2800; // time it takes to reach 100%

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

          {/* Center Container */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-sm px-8">
            
            {/* Logo / Preload Image */}
            {/* <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-14 w-full flex justify-center"
            >
              <Image 
                src="/preload.png"
                alt="Fantastic Limo Preloader"
                width={500}
                height={250}
                className="object-contain w-full h-auto max-w-[400px] md:max-w-[500px]"
                priority
              />
            </motion.div> */}

            {/* Progress Container */}
            <div className="w-full flex flex-col items-center gap-2 relative mt-4">
              
              {/* Premium Car Animation Track */}
              <div className="w-full relative h-16 sm:h-20 pointer-events-none mb-2">
                <motion.div
                  className="absolute bottom-0 h-full w-32 sm:w-40 z-10"
                  style={{ 
                    left: `${progress}%`, 
                    transform: `translateX(-${progress}%)` 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Image
                    src="/images/cadillac_escalade_side.png"
                    alt="Premium Loading Escalade"
                    fill
                    sizes="(max-width: 640px) 128px, 160px"
                    className="object-contain object-bottom "
                    priority
                  />
                  {/* Underglow Effect */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-luxury-gold/30 blur-[8px] rounded-full" />
                </motion.div>
                
                {/* Dynamic Road / Track Line under the car */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/5">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-luxury-gold/50 to-luxury-gold shadow-[0_0_10px_rgba(208,165,17,0.5)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col gap-3">
                {/* Progress Text */}
                <div className="flex justify-between w-full text-[10px] sm:text-[11px] font-bold text-luxury-gold uppercase tracking-[0.2em]">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full animate-pulse shadow-[0_0_8px_rgba(208,165,17,0.8)]" />
                    Preparing your ride
                  </span>
                  <span className="font-mono tracking-wider">{progress}%</span>
                </div>
                
                {/* Progress Bar Track */}
                <div className="w-full h-[2px] bg-white/10 overflow-hidden relative rounded-full">
                  {/* Progress Bar Fill */}
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-luxury-gold/40 to-luxury-gold shadow-[0_0_15px_rgba(208,165,17,1)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
