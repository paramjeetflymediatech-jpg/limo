"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Car, ShieldCheck } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Years Experience",
  },
  {
    icon: Users,
    value: 5000,
    suffix: "+",
    label: "VIP Clients Served",
  },
  {
    icon: Car,
    value: 120,
    suffix: "+",
    label: "Luxury Vehicles",
  },
  {
    icon: ShieldCheck,
    value: 24,
    suffix: "/7",
    label: "Concierge Support",
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 2000; // 2 seconds
    const range = end - start;
    let current = start;
    const increment = end > 100 ? Math.ceil(end / 60) : 1;
    const stepTime = Math.abs(Math.floor(duration / (range / increment)));

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-serif font-bold text-white">
      {count.toLocaleString()}
      <span className="text-luxury-gold">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section className="bg-matte-black py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* FIFA World Cup Event Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl mx-auto mb-16 p-5 rounded-lg border border-red-500 bg-white/95 backdrop-blur-md shadow-[0_0_25px_rgba(239,68,68,0.15)] text-left flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/35 flex items-center justify-center text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)] flex-shrink-0 animate-pulse">
              ⚽
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-600 font-bold block mb-1">
                USA & Canada 2026 Special Event Chauffeur
              </span>
              <h3 className="text-black text-base md:text-lg font-serif font-bold">
                FIFA World Cup Chauffeur Services
              </h3>
              <p className="text-gray-700 text-xs font-light mt-1">
                Luxury stadium transfers to Lumen Field (Seattle) & BC Place (Vancouver). Bypass traffic with VIP stadium drop-offs.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5 w-full md:w-auto justify-end">
            <Link
              href="/booking?dropoff=BC+Place,+Vancouver,+BC&vehicle=VIP+Executive+Sprinter"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 hero-text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center flex-1 sm:flex-initial"
            >
              BC Place (Vancouver)
            </Link>
            <Link
              href="/booking?dropoff=Lumen+Field,+Seattle,+WA&vehicle=VIP+Executive+Sprinter"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 border border-red-600 hero-text-white font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm text-center flex-1 sm:flex-initial"
            >
              Lumen Field (Seattle)
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="glass-panel p-6 md:p-8 rounded-lg flex flex-col items-center text-center group hover:border-luxury-gold/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-4 group-hover:scale-110 transition-transform duration-300 border border-luxury-gold/10">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-white text-xs md:text-sm uppercase tracking-wider font-light">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
