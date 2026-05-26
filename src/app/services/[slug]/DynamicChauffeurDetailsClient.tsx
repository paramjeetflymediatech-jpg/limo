"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Clock,
  BadgeCheck,
  ShieldAlert,
  Check,
  Shield,
  Briefcase,
  Award,
  Sparkles,
  Heart,
  Star,
  type LucideIcon,
} from "lucide-react";

// Icon lookup map — only serialisable strings cross the server→client boundary
const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  Clock,
  BadgeCheck,
  ShieldAlert,
  Check,
  Shield,
  Briefcase,
  Award,
  Sparkles,
  Heart,
  Star,
};

interface GridFeature {
  title: string;
  description: string;
  icon: string; // icon name string, resolved here
}

interface DynamicChauffeurDetailsClientProps {
  features: GridFeature[];
}

export default function DynamicChauffeurDetailsClient({ features }: DynamicChauffeurDetailsClientProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => {
        const Icon = ICON_MAP[feature.icon] ?? Compass;
        return (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-panel p-6 md:p-8 rounded-lg border border-luxury-gold/10 hover:border-luxury-gold/30 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-lg bg-luxury-gold/5 flex items-center justify-center text-luxury-gold mb-6 border border-luxury-gold/10 group-hover:scale-105 transition-transform duration-300">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-serif text-white mb-3 group-hover:text-luxury-gold transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-xs md:text-sm font-light leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
