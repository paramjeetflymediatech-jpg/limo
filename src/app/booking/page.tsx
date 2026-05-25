"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Calendar, Shield, Users, Clock, Star } from "lucide-react";
import BookingForm, { vehicleCategories } from "@/components/BookingForm";

// Create a component that consumes searchParams safely inside a Suspense boundary
function BookingContent() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    pickup: "",
    dropoff: "",
    dateTime: "",
    vehicle: vehicleCategories[0],
    passengers: "1",
  });

  useEffect(() => {
    const pickup = searchParams.get("pickup") || "";
    const dropoff = searchParams.get("dropoff") || "";
    const dateTime = searchParams.get("dateTime") || "";
    const vehicle = searchParams.get("vehicle") || vehicleCategories[0];
    const passengers = searchParams.get("passengers") || "1";

    setBookingDetails({ pickup, dropoff, dateTime, vehicle, passengers });

    // Simple submission check if query param contains 'submitted' or if client hits form button
    if (searchParams.get("submitted")) {
      setSubmitted(true);
    }
  }, [searchParams]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
      {/* Booking Form Card */}
      <div className="lg:col-span-2">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-8 md:p-16 rounded-xl border border-luxury-gold/20 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 rounded-full bg-luxury-gold/10 border border-luxury-gold flex items-center justify-center text-luxury-gold mb-8 relative">
              <Check className="w-10 h-10" />
              <div className="absolute inset-0 rounded-full border border-luxury-gold/20 animate-ping" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-4">
              Reservation Pending Confirmation
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-8 font-light">
              Your luxury chauffeur request has been successfully submitted. Our elite concierge team is verifying scheduling parameters, airport gates, and route feasibility. You will receive a booking voucher via email and SMS within 15 minutes.
            </p>

            {/* Mock Booking Details */}
            <div className="glass-panel p-6 rounded-lg w-full max-w-md border border-luxury-gold/15 text-left flex flex-col gap-4 text-xs md:text-sm mb-8">
              <div className="flex justify-between border-b border-luxury-gold/10 pb-3">
                <span className="text-gray-400 uppercase tracking-wider text-[10px]">Reference</span>
                <span className="text-white font-semibold tracking-widest uppercase">AR-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pickup</span>
                <span className="text-white text-right font-medium max-w-[200px] truncate">{bookingDetails.pickup || "Airport VIP Lounge"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Drop-off</span>
                <span className="text-white text-right font-medium max-w-[200px] truncate">{bookingDetails.dropoff || "Executive Offices"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle Type</span>
                <span className="text-luxury-gold font-medium">{bookingDetails.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date / Time</span>
                <span className="text-white font-medium">{bookingDetails.dateTime ? new Date(bookingDetails.dateTime).toLocaleString() : "Confirmed on itinerary"}</span>
              </div>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="px-8 py-4 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-matte-black transition-all duration-300 font-semibold text-xs uppercase tracking-widest"
            >
              Submit Another Reservation
            </button>
          </motion.div>
        ) : (
          <div className="glass-panel p-6 md:p-8 rounded-xl border border-luxury-gold/15 shadow-2xl">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">
              Complete Your Reservation
            </h2>
            <BookingForm />
          </div>
        )}
      </div>

      {/* Booking Side Info / Policies */}
      <div className="flex flex-col gap-6">
        <div className="glass-panel p-6 md:p-8 rounded-xl border border-luxury-gold/15 flex flex-col gap-6">
          <h3 className="text-sm font-serif text-luxury-gold uppercase tracking-widest font-semibold">
            Included in Every Booking
          </h3>
          <ul className="flex flex-col gap-4 text-xs md:text-sm text-gray-300">
            <li className="flex gap-3">
              <Clock className="w-5 h-5 text-luxury-gold shrink-0" />
              <span>Complimentary flight monitoring & delay tolerance</span>
            </li>
            <li className="flex gap-3">
              <Users className="w-5 h-5 text-luxury-gold shrink-0" />
              <span>Elite chauffeur holding a clean, digital greeting card</span>
            </li>
            <li className="flex gap-3">
              <Shield className="w-5 h-5 text-luxury-gold shrink-0" />
              <span>High-speed secure onboard WiFi and chargers</span>
            </li>
            <li className="flex gap-3">
              <Calendar className="w-5 h-5 text-luxury-gold shrink-0" />
              <span>Complimentary cancellation up to 24 hours prior</span>
            </li>
          </ul>
        </div>

        <div className="glass-panel p-6 md:p-8 rounded-xl border border-luxury-gold/15 text-center flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-luxury-gold/5 flex items-center justify-center border border-luxury-gold/20 text-luxury-gold mb-4">
            <Star className="w-5 h-5 fill-luxury-gold/10" />
          </div>
          <h3 className="text-sm font-serif text-white font-semibold mb-2">Need Custom Fleet Support?</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Our luxury ground transport operators can organize bulletproof vehicles, motorcade escorts, and customized branding.
          </p>
          <a
            href="tel:+1234567890"
            className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white font-bold transition-colors"
          >
            Call Dispatch (+1 234 567 890)
          </a>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Online Dispatch
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
            Reserve Chauffeur
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Specify your schedule, pickup details, and vehicle preferences. Our concierge team coordinates routing logistics to guarantee pure comfort.
          </p>
        </div>

        {/* Suspense Wrapper to satisfy Next.js useSearchParams requirements */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24">
              <span className="text-sm text-gray-500 uppercase tracking-widest animate-pulse">
                Initializing Reservation Module...
              </span>
            </div>
          }
        >
          <BookingContent />
        </Suspense>
      </div>
    </div>
  );
}
