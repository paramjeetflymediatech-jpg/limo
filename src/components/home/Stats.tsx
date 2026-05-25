"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, Car, ShieldCheck } from "lucide-react";

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
