"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

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

  if (!mounted) return null;
  if (pathname !== "/") return null;

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
            autoPlay
            muted
            playsInline
            onEnded={() => setShow(false)}
            className="w-full h-full object-cover"
          >
            {/* We dynamically switch the source based on screen size */}
            <source src={isMobile ? "/fanrtastic.webm" : "/preloarder.webm"} type="video/webm" />
            <source src={isMobile ? "/fanrtastic.mp4" : "/preloarder.mp4"} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
