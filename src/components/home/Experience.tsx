"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Experience() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Parallax */}
      <div className="absolute inset-0 w-full h-full -z-10 bg-matte-black">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-[0.4]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1920')`,
          }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-matte-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-matte-black via-transparent to-matte-black" />
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-6 block">
            Bespoke Journeys
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Not Just a Ride. An Elevation.
          </h2>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl leading-relaxed mb-10 font-light">
            Every detail is calibrated to your comfort. From climate control and acoustic glass insulation to the choice of sparkling or still mineral water, we curate an environment of absolute tranquility.
          </p>

          <Link
            href="/about"
            className="px-8 py-4 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-matte-black font-semibold text-xs uppercase tracking-widest transition-all duration-300"
          >
            Our Philosophy
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
