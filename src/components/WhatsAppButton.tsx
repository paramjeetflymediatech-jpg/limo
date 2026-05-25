"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/1234567890" // Replace with real company number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-matte-black border border-luxury-gold/50 rounded-full text-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] transition-all duration-300 hover:scale-110 group"
      aria-label="Contact us on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full border border-luxury-gold/20 animate-ping group-hover:duration-1000" />
      <MessageCircle className="w-7 h-7 fill-luxury-gold/10 group-hover:scale-110 transition-transform duration-300" />
    </a>
  );
}
