"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (show && mounted) {
      // Fallback in case video fails to load or play
      const timer = setTimeout(() => {
        setShow(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [show, mounted]);

  // Programmatically handle autoplay block / failures to avoid stuck preloader screen in Safari
  useEffect(() => {
    if (mounted && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Preloader video autoplay was prevented or failed:", error);
          // If autoplay is blocked by Safari/browser policies, hide preloader immediately so site is accessible
          setShow(false);
        });
      }
    }
  }, [mounted]);

  if (!mounted) return null;
  if (pathname !== "/") return null;

  const videoSrc = isMobile ? "/fanrtastic.mp4" : "/preloarder.mp4";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden"
        >
          <video
            ref={videoRef}
            key={videoSrc}
            src={videoSrc}
            autoPlay
            muted
            playsInline
            onEnded={() => setShow(false)}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
