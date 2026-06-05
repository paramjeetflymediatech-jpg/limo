"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function VideoSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
   const heroSlides = [
    { src: "/images/hero/whistler1.png", location: "Whistler Mountain" },
    { src: "/images/hero/sea_to_sky1.png", location: "Sea-to-Sky Highway" },
    { src: "/images/hero/lions_gate1.png", location: "Lions Gate Bridge" },
    { src: "/images/hero/gastown2.jpeg", location: "Gastown Steam Clock" },
    { src: "/images/hero/stanley_park1.png", location: "Stanley Park" },
  ];
  
   useEffect(() => {
   
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 3000);
      return () => clearInterval(interval);
   
  }, [heroSlides.length]);
  
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

        {/* Image Slideshow Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[550px] rounded-xl overflow-hidden border border-luxury-gold/15 group shadow-2xl bg-dark-gray"  
          
        >
          {heroSlides.map((slide, idx) => (
            <motion.div
              key={slide.src}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{
                opacity: currentSlide === idx ? 1 : 0,
                scale: currentSlide === idx ? 1 : 1.05
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={slide.src}
                alt={slide.location}
                width={1200}
                height={800}
                priority={idx === 0}
                quality={100}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-fit w-full h-full  transition-all duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          ))}

     

          {/* Location Indicator Overlay */}
          <div className="absolute top-6 right-6 z-20 hidden md:flex items-center gap-3 px-4 py-2 bg-matte-black/60 backdrop-blur-md rounded-md border border-white/10 shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={currentSlide}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] uppercase tracking-[0.25em] text-white font-bold"
              >
                {heroSlides[currentSlide].location}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
