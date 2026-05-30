"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function VideoSection() {
  return (
    <section className="bg-matte-black theme-dark py-24 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-bold mb-3 block">
            Exclusive Journeys
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            The FantasticLimo Experience
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed font-light">
            Take a seat inside our prestige cabins. Catch a glimpse of the precision, privacy, and hospitality delivered by our elite chauffeur network.
          </p>
        </div>

        {/* Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[550px] rounded-xl overflow-hidden border border-luxury-gold/15 group shadow-2xl bg-dark-gray"
        >
          {/* Bridge Day Image */}
          <Image
            src="/bridge/day.jpg"
            alt="FantasticLimo Bridge Day Experience"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
            className="object-cover brightness-[0.8] group-hover:brightness-[0.9] group-hover:scale-105 transition-all duration-700 ease-out"
          />

          {/* Gradient Overlay for Sleek Styling */}
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black/50 via-transparent to-matte-black/20 pointer-events-none" />

          {/* Elegant Accent Border */}
          <div className="absolute inset-0 border border-luxury-gold/10 rounded-xl pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}

