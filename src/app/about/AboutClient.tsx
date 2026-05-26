"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Users, Eye, Target } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description: "Every operator completes defensive driving and road emergency training. Vehicles undergo daily mechanical safety scans.",
  },
  {
    icon: Users,
    title: "Elite Chauffeurs",
    description: "Recruited from backgrounds in corporate service, VIP diplomacy, and government defense. Completely vetted.",
  },
  {
    icon: Eye,
    title: "Absolute Privacy",
    description: "Your files, discussions, calls, and travel partners are strictly confidential. Our fleet is equipped with privacy partitions.",
  },
  {
    icon: Target,
    title: "Punctuality",
    description: "We arrive 15 minutes early as our core operational policy. Time is the ultimate luxury, and we respect yours.",
  },
];

export default function AboutClient() {
  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Our Legacy
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Crafting Premium Journeys
          </h1>
          <p className="text-white text-sm md:text-base font-light leading-relaxed">
            Since our inception, FantasticLimo Chauffeurs has stood for absolute precision, security, and prestige in corporate and luxury mobility.
          </p>
        </div>

        {/* Text Block & Image */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">
              The FantasticLimo Standards
            </h2>
            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-6">
              Founded on the belief that private transportation should mirror the standards of private aviation, FantasticLimo delivers customized travel solutions worldwide. We operate in critical economic hubs, delivering flawless logistics to CEOs, heads of state, celebrities, and VIP entities.
            </p>
            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
              Every detail is calibrated to your comfort. From climate control and acoustic glass insulation to the choice of mineral water, we curate an environment of absolute tranquility.
            </p>
            <Link
              href="/booking"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            >
              Book Chauffeur Now
            </Link>
          </div>

          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800"
              alt="Luxury Car Interior Details"
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover brightness-75 animate-pulse-slow"
            />
          </div>
        </div>

        {/* Core Pillars */}
        <div className="border-t border-luxury-gold/10 pt-20">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold mb-3 block">
              Core Principles
            </span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white">
              The Four Pillars of FantasticLimo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-panel p-8 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-6 border border-luxury-gold/10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-serif text-white mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-white/95 text-xs md:text-sm font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
