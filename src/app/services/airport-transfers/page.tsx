"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Plane, Compass, Clock, BadgeAlert, ShieldAlert, Check } from "lucide-react";

const features = [
  {
    icon: Compass,
    title: "Flight Tracking",
    description: "We monitor your incoming flights in real-time. Whether early or delayed, your chauffeur will be waiting.",
  },
  {
    icon: Clock,
    title: "Extended Wait Times",
    description: "Enjoy complimentary wait times of 60 minutes for international arrivals, and 30 minutes for domestic routes.",
  },
  {
    icon: BadgeAlert,
    title: "Meet & Greet Protocol",
    description: "Your chauffeur will greet you inside the terminal with an electronic nameplate, handles baggage, and guides you to the vehicle.",
  },
  {
    icon: ShieldAlert,
    title: "Discreet Kerbside Pickups",
    description: "For rapid departures, choose our premium curbside meet. Step directly out of the terminal door and into the car.",
  },
];

export default function AirportTransfersPage() {
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
              VIP Arrivals & Departures
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              Airport Transfers Crafted for Executives
            </h1>
            <p className="text-white text-sm md:text-base font-light leading-relaxed mb-8">
              Navigating busy terminals can be stressful. FantasticLimo turns airport arrivals and departures into a fluid, relaxing transition. We handle everything from luggage transport to private runway gate clearance.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                "Complimentary flight tracking & gate adjustments",
                "Professional chauffeur greetings inside arrivals terminal",
                "Executive fleet (Rolls Royce, S-Class, Cadillac Escalade)",
                "Bottled mineral water & phone chargers onboard",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <Link
              href="/booking?service=Airport%20Transfers"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              Book Airport Transfer
            </Link>
          </div>

          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15">
            <Image
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800"
              alt="Airport Limousine Transfer"
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-cover brightness-75"
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
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
                  {feature.title}
                </h3>
                <p className="text-white/95 text-xs md:text-sm font-light leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
