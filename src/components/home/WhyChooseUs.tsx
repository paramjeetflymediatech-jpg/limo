"use client";

import { motion } from "framer-motion";
import { UserCheck, Star, EyeOff, CalendarRange, Crown, Globe } from "lucide-react";

const benefits = [
  {
    icon: UserCheck,
    title: "Professional Chauffeurs",
    description: "Highly trained, vetted, and bilingual operators dedicated to defense driving and VIP protocol.",
  },
  {
    icon: Star,
    title: "Immaculate Luxury Fleet",
    description: "Vehicles detailed daily, smoke-free, equipped with bottled water, charge ports, and onboard Wi-Fi.",
  },
  {
    icon: EyeOff,
    title: "Privacy Guaranteed",
    description: "Strict non-disclosure agreements signed by all personnel. Your itineraries remain completely secure.",
  },
  {
    icon: CalendarRange,
    title: "24/7 Concierge Support",
    description: "A dedicated live dispatch operator is ready to adjust schedules, manage route updates, or coordinate security.",
  },
  {
    icon: Crown,
    title: "Bespoke VIP Concierge",
    description: "From securing runway access to arranging custom in-cabin amenities, we cater to every tailored request.",
  },
  {
    icon: Globe,
    title: "Seamless Global Coverage",
    description: "Consistent, ultra-luxury chauffeur services available across key financial hubs and leisure hubs worldwide.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-dark-gray py-24 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-[#D0A511] font-black mb-3 block">
            Why Choose FantasticLimo
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            Standards that Exceed Expectations
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed font-light">
            We do not just transport; we elevate your entire journey. Ground transportation designed around your schedule, security, and prestige.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel p-8 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 hover:bg-matte-black/60 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-6 border border-luxury-gold/10 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-white mb-4 group-hover:text-luxury-gold transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="  text-xs md:text-sm leading-relaxed font-light">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
