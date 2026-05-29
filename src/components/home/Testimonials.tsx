"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sir Alexander Wright",
    role: "Private Equity Executive",
    content: "The level of professionalism displayed by the FantasticLimo chauffeurs is unparalleled. Every transfer feels private, safe, and impeccably timed. Truly the private aviation of ground transport.",
    stars: 5,
  },
  {
    id: 2,
    name: "Elizabeth Sterling",
    role: "VIP Luxury Advisor",
    content: "We hired their fleet for a high-profile corporate roadshow in Dubai. The Cadillac Escalades were spotless, drivers and dispatch were highly responsive, and route coordination was flawless.",
    stars: 5,
  },
  {
    id: 3,
    name: "His Excellency J. Al-Maktoum",
    role: "Diplomatic Envoy",
    content: "FantasticLimo Chauffeurs provides absolute privacy and defense driving of the highest tier. When discretion and security are paramount, they are our sole choice.",
    stars: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="bg-matte-black py-24 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-[#D0A511] font-black mb-3 block">
          Client Endorsements
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12">
          Trusted by Global Leaders
        </h2>

        {/* Slider Window */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="glass-panel p-8 md:p-12 rounded-lg border border-luxury-gold/15 shadow-2xl relative w-full"
            >
              {/* Quote Mark */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-luxury-gold flex items-center justify-center text-matte-black shadow-lg">
                <Quote className="w-5 h-5 fill-matte-black" />
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6 mt-2">
                {Array.from({ length: testimonials[activeIndex].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-luxury-gold fill-luxury-gold" />
                ))}
              </div>

              <blockquote className="text-gray-200 text-base md:text-xl font-light italic leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </blockquote>

              <div>
                <cite className="not-italic text-sm md:text-base font-serif font-semibold text-white block">
                  {testimonials[activeIndex].name}
                </cite>
                <span className="text-xs text-luxury-gold uppercase tracking-widest mt-1 block">
                  {testimonials[activeIndex].role}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Controls */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white hover:border-luxury-gold hover:bg-luxury-gold/15 transition-all z-20 bg-matte-black/50"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-luxury-gold/20 flex items-center justify-center text-luxury-gold hover:text-white hover:border-luxury-gold hover:bg-luxury-gold/15 transition-all z-20 bg-matte-black/50"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-6 bg-luxury-gold" : "bg-gray-600 hover:bg-gray-400"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
