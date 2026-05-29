"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceGalleryProps {
  primaryImage: string;
  imagesJson?: string;
  serviceName: string;
}

export default function ServiceGallery({ primaryImage, imagesJson, serviceName }: ServiceGalleryProps) {
  let additionalImages: string[] = [];
  try {
    if (imagesJson) {
      const parsed = JSON.parse(imagesJson);
      if (Array.isArray(parsed)) {
        additionalImages = parsed.filter(img => typeof img === "string" && img.trim() !== "");
      }
    }
  } catch (e) {
    console.error("Failed to parse imagesJson:", e);
  }

  const gallery = Array.from(new Set([primaryImage, ...additionalImages].filter(Boolean)));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, gallery.length]);

  // Disable body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen]);

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-28">
      {/* Active Display Screen */}
      <div 
        onClick={() => setIsLightboxOpen(true)}
        className="relative h-[300px] md:h-[450px] overflow-hidden rounded-lg bg-matte-black cursor-zoom-in group"
      >
        {gallery.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={gallery[activeImageIndex]}
                  alt={`${serviceName} main image`}
                  fill
                  priority
                  sizes="(max-w: 768px) 100vw, 50vw"
                  className="object-contain brightness-75 group-hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </AnimatePresence>

            {/* Zoom overlay indicator */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="p-3 rounded-full bg-matte-black/80 backdrop-blur-sm border border-luxury-gold/30 text-[#D0A511] shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
            <span className="text-[#D0A511] text-xs uppercase tracking-widest opacity-50">No Image</span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative aspect-video rounded overflow-hidden border bg-charcoal/60 transition-all cursor-pointer ${
                activeImageIndex === idx
                  ? "border-luxury-gold shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-[1.03]"
                  : "border-luxury-gold/15 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${serviceName} thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal rendered via Portal to render outside sticky columns */}
      {mounted && typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-0 left-0 w-full h-full z-[100000] bg-black/95 backdrop-blur-md flex flex-col justify-center items-center select-none"
              onClick={() => setIsLightboxOpen(false)}
            >
              {/* Image Container */}
              <div className="relative w-[90vw] h-[80vh] flex items-center justify-center z-10" onClick={(e) => e.stopPropagation()}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={gallery[activeImageIndex]}
                      alt={`${serviceName} main image full screen`}
                      fill
                      sizes="90vw"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all z-[100] cursor-pointer lightbox-btn"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Prev Button */}
              {gallery.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
                  }}
                  className="absolute left-6 p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all z-[100] cursor-pointer lightbox-btn"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {gallery.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-6 p-4 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all z-[100] cursor-pointer lightbox-btn"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Counter */}
              <div className="absolute bottom-6 text-xs uppercase tracking-widest lightbox-counter z-[100]">
                {activeImageIndex + 1} of {gallery.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
