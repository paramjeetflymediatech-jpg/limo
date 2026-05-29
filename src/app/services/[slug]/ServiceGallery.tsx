"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:sticky lg:top-28">
      {/* Active Display Screen */}
      <div className="relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15 shadow-2xl bg-matte-black">
        {gallery.length > 0 ? (
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
                className="object-contain brightness-75 hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </AnimatePresence>
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
    </div>
  );
}
