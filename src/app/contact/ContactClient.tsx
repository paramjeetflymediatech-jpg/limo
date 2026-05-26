"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, Check } from "lucide-react";

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const inputStyles = "w-full bg-matte-black border border-luxury-gold/15 focus:border-luxury-gold/50 text-white placeholder-gray-500 rounded-md py-3 px-4 text-sm outline-none transition-all duration-300";
  const labelStyles = "block text-xs uppercase tracking-widest text-luxury-gold font-medium mb-2";

  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Elite Chauffeur Desk
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Our dispatch agents and corporate planners are available 24 hours a day, 7 days a week to support your global transportation logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-serif font-bold text-white">
              Corporate Headquarters
            </h2>
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-lg">
              For security requests, custom fleet bookings, wedding packages, or billing inquiries, reach out to our dedicated operations desk.
            </p>

            {/* Support Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Phone, title: "Phone", details: "+1 (234) 567-890", href: "tel:+1234567890" },
                { icon: Mail, title: "Email", details: "concierge@fantasticlimo.com", href: "mailto:concierge@fantasticlimo.com" },
                { icon: MapPin, title: "Address", details: "100 VIP Boulevard, Dubai, UAE", href: "#" },
                { icon: Clock, title: "Hours", details: "24/7 Dispatch Availability", href: "#" },
              ].map(({ icon: Icon, title, details, href }) => (
                <div key={title} className="glass-panel p-6 rounded-lg border border-luxury-gold/10">
                  <div className="w-10 h-10 rounded-full bg-luxury-gold/5 flex items-center justify-center text-luxury-gold border border-luxury-gold/10 mb-4">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-serif text-white font-semibold mb-1">{title}</h3>
                  {href !== "#" ? (
                    <a href={href} className="text-xs text-gray-400 hover:text-luxury-gold transition-colors">
                      {details}
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">{details}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Embedded Map Visualizer */}
            <div className="h-64 rounded-lg bg-dark-gray border border-luxury-gold/10 overflow-hidden relative flex items-center justify-center group">
              <div className="absolute inset-0 bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
              <div className="relative z-10 flex flex-col items-center">
                <MapPin className="w-8 h-8 text-luxury-gold animate-bounce mb-2" />
                <span className="text-xs uppercase tracking-widest text-gray-300 font-semibold">FantasticLimo Dubai Hub</span>
                <span className="text-[10px] text-gray-500 mt-1">25.2048° N, 55.2708° E</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Contact Inquiry Form Column */}
          <div className="glass-panel p-8 md:p-12 rounded-xl border border-luxury-gold/15 shadow-2xl relative">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-6">
              Send Concierge Message
            </h2>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-12"
              >
                <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold flex items-center justify-center text-luxury-gold mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">Message Received</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                  Our VIP Concierge coordinator has been notified. We will contact you at your provided details shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label className={labelStyles}>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Sir / Madam Name"
                    className={inputStyles}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyles}>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="client@executive.com"
                      className={inputStyles}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelStyles}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={inputStyles}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelStyles}>Inquiry Subject</label>
                  <select
                    name="subject"
                    value={formState.subject}
                    onChange={handleChange}
                    className={`${inputStyles} appearance-none cursor-pointer`}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Corporate Account">Corporate Account Setup</option>
                    <option value="Bespoke Events">Bespoke Wedding/Event Booking</option>
                    <option value="Security Detail">Private Security Escort</option>
                  </select>
                </div>

                <div>
                  <label className={labelStyles}>Message / Requirements</label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    placeholder="Detail your transport specifications or special requirements..."
                    rows={4}
                    className={inputStyles}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest py-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
