"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    alt: "Luxury Sedan Silhouette",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&q=80&w=800",
    alt: "Prestige Details",
    className: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
    alt: "Dashboard Details",
    className: "col-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800",
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
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 brightness-[0.75] group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-6">
                <div>
                  <p className="text-white font-serif text-base font-semibold">{img.alt}</p>
                  <p className="text-luxury-gold text-xs uppercase tracking-widest mt-1">@fantasticlimo</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-luxury-gold/10 backdrop-blur-sm border border-luxury-gold/30 flex items-center justify-center text-luxury-gold">
                  <InstagramIcon className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
