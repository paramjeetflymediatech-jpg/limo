"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Fallback in case video fails to load or play
    const timer = setTimeout(() => {
      setShow(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

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
            className="w-full h-full object-contain lg:object-cover"
          >
            <source src="/preloarder.mp4" type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
