"use client";

import { useEffect, useState, useRef } from "react";
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
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    if (progress >= 5) {
      setShowLogo(true);
    }
  }, [progress, shouldRender]);
 
  // Cache safety check: If video is already loaded from cache before event listeners mount
  useEffect(() => {
    if (!shouldRender) return;
    if (videoRef.current && videoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, [shouldRender]);

  if (isMounted && !shouldRender) {
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
          {/* Background Video */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlay={() => setVideoLoaded(true)}
              className={`object-cover w-full h-full transition-opacity duration-1000 ${videoLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
              <source
                src="/CarDriving.mp4"
                type="video/mp4"
              />
            </video>

            {/* Cinematic dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
          </div>

          {/* Ambient Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

          {/* Cinematic Background Lines / Road Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_0%,transparent_80%)] pointer-events-none" />

          {/* Minimal Bottom loading progress */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 w-full max-w-[240px] text-center">
            <span className="text-[9px] tracking-[0.35em] hero-text-white-muted uppercase font-light">
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

