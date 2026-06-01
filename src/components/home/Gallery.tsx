"use client";

import { motion } from "framer-motion";
import Image from "next/image";


const galleryImages = [
  {
    src: "/1.png",
    alt: "Luxury Sedan Silhouette",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/2.png",
    alt: "Prestige Details",
    className: "col-span-1",
  },
  {
    src: "/3.png",
    alt: "Dashboard Details",
    className: "col-span-1",
  },
  {
    src: "/4.png",
    alt: "Executive Rear Lounge",
    className: "col-span-1 md:col-span-2",
  },
];


export default function Gallery() {
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
            A visual documentation of the travel standard we deliver. Follow our global journeys on social media.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {galleryImages.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-lg group border border-luxury-gold/5 hover:border-luxury-gold/20 ${img.className}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
