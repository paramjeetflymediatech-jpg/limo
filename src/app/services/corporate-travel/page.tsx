"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, Shield, Clock, Award, Check } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Absolute Confidentiality",
    description: "Every chauffeur signed a strict NDA. Your business discussions, client phone calls, and files remain fully private.",
  },
  {
    icon: Clock,
    title: "Meticulous Punctuality",
    description: "Chauffeurs arrive 15 minutes before the scheduled time. Your calendar is our master document.",
  },
  {
    icon: Briefcase,
    title: "Roadshow Excellence",
    description: "Coordinated logistics for multi-stop corporate agendas. Live dispatcher oversight for quick routing shifts.",
  },
  {
    icon: Award,
    title: "Corporate Billing",
    description: "Consolidated monthly billing, receipts on demand, and seamless corporate accounts setup.",
  },
];

export default function CorporateTravelPage() {
  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/services"
          className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white mb-8 inline-block transition-colors"
        >
          &larr; Back to Services
        </Link>

        {/* Hero Row */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
              Executive Mobility Solutions
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Corporate Travel Engineered for Efficiency
            </h1>
            <p className="text-white text-sm md:text-base font-light leading-relaxed mb-8">
              FantasticLimo operates as a mobile boardroom, keeping you connected, comfortable, and productive. Focus on your business strategy while we handle optimal routing, traffic management, and schedule synchronization.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                "Executive WiFi, wireless chargers, and writing trays",
                "Professional chauffeurs in complete business attire",
                "Real-time dispatch coordination and tracking",
                "Flexible hourly booking structure for corporate schedules",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/booking?service=Corporate%20Travel"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              Setup Corporate Account
            </Link>
          </div>

          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15">
            <Image
              src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800"
              alt="Corporate Executive Transport"
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover brightness-75"
            />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-lg border border-luxury-gold/10"
              >
                <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-6 border border-luxury-gold/10">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/95 text-xs md:text-sm font-light leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
