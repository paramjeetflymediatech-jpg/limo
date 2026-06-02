"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";


interface GalleryProps {
  services?: any[];
}

export default function Gallery({ services = [] }: GalleryProps) {
  const router = useRouter();

  if (!services || services.length === 0) {
    return null;
  }

  const displayItems = services.slice(0, 4).map((s, i) => ({
    src: s.image,
    alt: s.name,
    slug: s.slug,
    className: i === 0 ? "md:col-span-2 md:row-span-2" : (i === 3 ? "col-span-1 md:col-span-2" : "col-span-1")
  }));

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {displayItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              onClick={() => item.slug && router.push(`/services/${item.slug}`)}
              className={`relative overflow-hidden rounded-lg group border border-luxury-gold/5 hover:border-luxury-gold/20 ${item.className} ${item.slug ? 'cursor-pointer' : ''}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.8] group-hover:brightness-100"
              />
              {/* Optional title overlay on hover */}
              {item.slug && (
                <div className="absolute inset-0 bg-matte-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="text-luxury-gold uppercase tracking-widest text-xs font-bold border border-luxury-gold/30 px-4 py-2 bg-matte-black/60 backdrop-blur-sm">
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
