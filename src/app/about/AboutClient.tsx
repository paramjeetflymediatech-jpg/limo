"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

const stats = [
  { label: "New Cars", value: "90%" },
  { label: "In-house Chauffuers", value: "100%" },
  { label: "Satisfaction Rate", value: "95%" },
  { label: "Willing To Come Back", value: "100%" },
];

export default function AboutClient() {
  return (
    <div className="bg-white min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            About Us
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Story About Us
          </h1>
        </div>

        {/* Story Section */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src="/about.png"
              alt="Luxury Limousine Service"
              width={800}
              height={800}
              className="w-full h-auto object-contain"
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed">
              Fantastic Limo proudly serves as Vancouver&apos;s premier luxury chauffeur service, delivering unparalleled luxury, comfort, and security to our esteemed clients. With our dedicated fleet management team overseeing operations, we guarantee top-notch service and a seamless experience.
            </p>
            <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed">
              Our chauffeurs are meticulously selected for their expertise and commitment to excellence, ensuring they can adeptly handle any transportation challenge with ease. When it comes to luxury transportation in Vancouver as a full service, Fantastic Limo stands out as the epitome of sophistication and reliability.
            </p>
            <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed">
              As a full-service provider available 24/7, we offer a wide range of rental services, including corporate transportation, intercity transfers, airport and port transfers, limousine services, hourly rentals, event transportation, city tours, staff transport, and quality chauffeur services. Reach out to us to establish a partnership built on trust, ensuring your journey is adorned with five-star luxuries.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center p-8 rounded-2xl bg-white/5 border border-luxury-gold/10 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
            >
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-luxury-gold mb-4">
                {stat.value}
              </h3>
              <p className="text-sm md:text-base text-gray-300 font-medium tracking-wide uppercase">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Satisfaction Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-luxury-gold/10 to-transparent p-10 md:p-16 rounded-3xl border border-luxury-gold/20 mb-24 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Star className="w-48 h-48 text-luxury-gold" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Your satisfaction is our priority.
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              We offer exceptional transportation services, including airport transfers, intercity rides, port transportation, chauffeur and limousine services, and hourly rentals, along with various other amenities. Our customers rave about Fantastic Limo&apos;s chauffeur services, praising our knowledgeable and experienced chauffeurs who go above and beyond to assist.
            </p>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed">
              With prompt pickups, competitive rates, and meticulously sanitized vehicles after each ride, we enhance the efficiency and effectiveness of our business. As a result, our clients perceive us as providing better value, offering gratifying and enjoyable services, all supported by our friendly customer service.
            </p>
          </div>
        </motion.div>

        {/* Pricing CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto bg-white/5 p-10 md:p-12 rounded-3xl border border-luxury-gold/30"
        >
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6">
            What about pricing?
          </h2>
          <p className="text-luxury-gold text-lg md:text-xl font-medium mb-10">
            Don&apos;t worry. We provide very nice deals and the most competitive price just for you!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-10 py-4 bg-luxury-gold text-white font-semibold text-sm uppercase tracking-widest hover:bg-white hover:text-matte-black transition-all duration-300 shadow-[0_0_20px_rgba(208,165,17,0.3)] rounded-full"
          >
            Get a Quote Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
