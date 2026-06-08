"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Gallery() {
  const displayItems = [
    {
      src: "/Artoftravel/50fb9df2-31dc-462f-a348-f9251b4c5202.png",
      alt: "Airport Transfers",
      href: "https://demo.socialflymediatech.com/services/airport-transfers",
    },
    {
      src: "/Artoftravel/b1cb5216-aba9-45c3-8418-de92307bef41.png",
      alt: "Private Jet Charters",
      href: "https://demo.socialflymediatech.com/services/private-jet-charters",
    },
    {
      src: "/Artoftravel/d15e7675-8d5f-4824-9b11-1a51632fa9e2.png",
      alt: "Corporate Transportation",
      href: "https://demo.socialflymediatech.com/services/corporate-transportation",
    },
    {
      src: "/Artoftravel/e8c72561-afb8-480e-af56-4d5626234911.png",
      alt: "Event Transportation",
      href: "https://demo.socialflymediatech.com/services/event-transportation",
    }
  ];

  return (
    <section className=" py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-black mb-3 block">
            FantasticLimo Lifestyle
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            The Art of Travel
          </h2>
          <p className="text-white text-sm font-light leading-relaxed">
            A visual documentation of the travel standard we deliver. Click an image to explore the service.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {displayItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              onClick={() => item.href && window.location.assign(item.href)}
              className={`relative overflow-hidden group aspect-video rounded-lg ${item.href ? 'cursor-pointer' : ''}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Optional title overlay on hover */}
              {item.href && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold border border-luxury-gold/10 px-4 py-2 bg-white backdrop-blur-sm">
                    View Detail
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
