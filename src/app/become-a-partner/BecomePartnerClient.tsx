"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Handshake, Globe, ShieldCheck, Star, Send } from "lucide-react";
import Image from "next/image";

export default function BecomePartnerClient() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    industry: "hotel",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      setIsSuccess(true);
      setFormData({ companyName: "", contactName: "", email: "", phone: "", industry: "hotel", message: "" });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: <Globe className="w-6 h-6 text-luxury-gold" />,
      title: "Global Reach",
      description: "Access our exclusive network of elite chauffeurs across major international hubs."
    },
    {
      icon: <Star className="w-6 h-6 text-luxury-gold" />,
      title: "Premium Commissions",
      description: "Enjoy lucrative commission structures for every successful referral and booking."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-luxury-gold" />,
      title: "Uncompromising Standards",
      description: "We guarantee the highest level of security, privacy, and vehicle excellence."
    },
    {
      icon: <Handshake className="w-6 h-6 text-luxury-gold" />,
      title: "Dedicated Account Management",
      description: "Receive priority 24/7 dispatch support and a dedicated corporate liaison."
    }
  ];

  return (
    <div className="min-h-screen bg-matte-black pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden mb-16">
        <Image
          src="/images/luxury_limo_lounge.png"
          alt="Luxury Partner"
          fill
          className="object-cover opacity-30 brightness-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-matte-black/50 to-matte-black" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className=" text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold mb-6 inline-block bg-luxury-gold border border-luxury-gold/20 px-6 py-2.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(208,165,17,0.15)]"
          >
            B2B Transportation Solutions
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight"
          >
            Join The Elite <br />Global Network
          </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Column - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <h2 className="text-3xl font-serif font-bold text-white mb-6">Partner With Excellence</h2>
          <p className="text-gray-400 font-light leading-relaxed mb-10 text-sm">
            Whether you represent a 5-star hotel, an executive travel agency, or a multinational corporation, partnering with Fantastic Limo ensures your clients receive world-class mobility solutions. Elevate your service offerings and build a mutually rewarding relationship with the industry leader in luxury transport.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">{benefit.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-panel p-8 md:p-10 rounded-xl border border-luxury-gold/20 shadow-2xl relative overflow-hidden bg-dark-gray/60 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-luxury-gold to-transparent" />

            <h3 className="text-2xl font-serif font-bold text-white mb-2">Partnership Inquiry</h3>
            <p className="text-xs text-gray-400 mb-8 uppercase tracking-widest">Submit your details for review</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Company Name</label>
                  <input
                    required
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="e.g. Prestige Travel"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Contact Name</label>
                  <input
                    required
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full   border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full   border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone Number</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full   border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Industry / Type</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full   border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors appearance-none"
                  style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"%23D0A511\"><path d=\"M7 10l5 5 5-5z\"/></svg>')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px" }}
                >
                  <option value="hotel" className="bg-matte-black">Luxury Hotel / Resort</option>
                  <option value="travel_agency" className="bg-matte-black">Travel Agency / Concierge</option>
                  <option value="corporate" className="bg-matte-black">Corporate Enterprise</option>
                  <option value="event_planner" className="bg-matte-black">Event / Wedding Planner</option>
                  <option value="other" className="bg-matte-black">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Partnership Proposal</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full   border border-white/10 rounded px-4 py-3 text-sm text-white focus:outline-none focus:border-luxury-gold transition-colors resize-none"
                  placeholder="Tell us about your organization and how we can collaborate..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-full bg-luxury-gold hover:bg-[#b58f0f] text-black font-bold uppercase tracking-widest text-xs py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : (
                  <>
                    <span>Submit Application</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-xs text-center font-medium"
                >
                  Thank you! Your partnership inquiry has been received. Our executive team will contact you shortly.
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
