"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Shield, Sparkles, Trophy } from "lucide-react";

// Fleet video data
const videosList = [
  {
    id: "rolls-royce",
    title: "Rolls-Royce Phantom: The Sovereign",
    category: "Ultra-Luxury Sedan",
    desc: "Experience the pinnacle of automotive craftsmanship. Silent, powerful, and majestic, floating through the city lights.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-black-car-driving-through-the-city-at-night-42295-large.mp4",
    posterUrl: "/images/rolls_royce_night.png",
    duration: "0:45",
  },
  {
    id: "s-class",
    title: "Mercedes-Benz S-Class: Elite Chauffeur",
    category: "Executive Sedan",
    desc: "The global benchmark for executive travel. Combining cutting-edge technology with unmatched comfort and active styling.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-chauffeur-opening-the-door-of-a-luxury-car-34407-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800",
    duration: "0:30",
  },
  {
    id: "sprinter",
    title: "VIP Executive Sprinter: Mobile Lounge",
    category: "Luxury Van",
    desc: "A first-class private jet cabin on wheels. Perfect for boardrooms on the move, group transport, and red-carpet entries.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-modern-luxury-car-42297-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
    duration: "0:38",
  },
  {
    id: "bentley",
    title: "Bentley Mulsanne: British Sophistication",
    category: "Premium Luxury",
    desc: "Where hand-stitched leather meets raw performance. Indulge in an atmosphere that is uniquely heritage-driven.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coupe-car-driving-on-a-road-in-a-forest-41656-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=800",
    duration: "0:42",
  },
  {
    id: "escalade",
    title: "Cadillac Escalade: Bold Presence",
    category: "Luxury SUV",
    desc: "Commanding, secure, and spacious. Outfitted with bespoke luxury accents and high-definition noise isolation.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-black-car-driving-on-a-wet-road-at-sunset-41724-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=800",
    duration: "0:35",
  },
  {
    id: "stretch-limo",
    title: "Presidential Lincoln: The Celebration",
    category: "Super Stretch Limo",
    desc: "An icon of grandeur and celebration. Features a full private bar, customized fiber-optic star roof, and dual partition walls.",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-drifting-on-a-wet-track-41639-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800",
    duration: "0:40",
  },
];

export default function VideoTour() {
  const [activeVideo, setActiveVideo] = useState<typeof videosList[0] | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  const openVideo = (video: typeof videosList[0]) => {
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <main className="bg-matte-black text-white min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Cinematic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Breadcrumb & Subheading */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs uppercase tracking-[0.4em] text-luxury-gold font-semibold mb-4 block"
          >
            Brand Cinematic Experience
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-wide leading-tight"
          >
            FantasticLimo in Motion
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 text-sm md:text-lg font-light leading-relaxed max-w-2xl mx-auto"
          >
            Enter the private world of first-class chauffeur service. Indulge in Hollywood-grade cinematography capturing our premium fleet across global cities.
          </motion.p>
        </div>

        {/* Brand Showcase Centerpiece Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative w-full h-[320px] md:h-[600px] rounded-2xl overflow-hidden border border-luxury-gold/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-20 group"
        >
          {/* Main Visual Poster Image */}
          <Image
            src="/images/rolls_royce_night.png"
            alt="Rolls Royce luxury limousine driving through futuristic Dubai streets"
            fill
            priority
            sizes="(max-w-768px) 100vw, 1200px"
            className="object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[4000ms] brightness-50"
          />

          {/* Ambient Film Grain and Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-transparent to-matte-black/40 pointer-events-none" />

          {/* Title & Floating Play Button overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-2 block">
                  Signature Commercial
                </span>
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-3">
                  The Art of Chauffeurship at Night
                </h2>
                <p className="text-white/85 text-xs md:text-sm font-light leading-relaxed">
                  Watch our presidential Rolls-Royce Phantom cruise gracefully through reflective city avenues, reflecting the ultimate signature VIP style.
                </p>
              </div>

              <div>
                <button
                  onClick={() => openVideo(videosList[0])}
                  className="flex items-center gap-3 bg-luxury-gold hover:bg-soft-gold text-matte-black px-6 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-matte-black" />
                  Play Brand Video
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid: Interactive Fleet Videos */}
        <div className="mb-24">
          <div className="text-left mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-semibold mb-2 block">
              Fleet Showcases
            </span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-white">
              The Prestige Fleet in Motion
            </h3>
            <div className="w-12 h-[2px] bg-luxury-gold mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videosList.map((video, idx) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel border border-luxury-gold/15 rounded-xl overflow-hidden flex flex-col group hover:border-luxury-gold/45 transition-all duration-500 hover:-translate-y-1 shadow-lg"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={video.posterUrl}
                    alt={video.title}
                    fill
                    sizes="(max-w-768px) 100vw, 400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-[2000ms] brightness-[0.7]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 to-transparent pointer-events-none" />

                  {/* Play circle overlay */}
                  <button
                    onClick={() => openVideo(video)}
                    className="absolute inset-0 m-auto w-14 h-14 bg-matte-black/70 backdrop-blur-sm border border-luxury-gold/40 text-luxury-gold rounded-full flex items-center justify-center hover:scale-110 hover:bg-luxury-gold hover:text-matte-black hover:border-luxury-gold transition-all duration-300 shadow-md"
                    aria-label={`Play ${video.title}`}
                  >
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </button>

                  <span className="absolute bottom-4 right-4 bg-matte-black/80 px-2 py-1 rounded text-[10px] tracking-widest border border-white/10">
                    {video.duration}
                  </span>
                </div>

                {/* Text Metadata */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-2 block">
                      {video.category}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-white mb-3 group-hover:text-luxury-gold transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-white/80 text-xs font-light leading-relaxed mb-6">
                      {video.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => openVideo(video)}
                    className="text-xs uppercase tracking-widest font-semibold text-luxury-gold hover:text-white transition-colors text-left flex items-center gap-2 group/btn"
                  >
                    Play Showcase Video
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">&rarr;</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Behind the Scenes & Service Standards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-xl border border-luxury-gold/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-white mb-3">
                Presidential Security Standards
              </h4>
              <p className="text-white/80 text-xs font-light leading-relaxed">
                All vehicles feature advanced anti-tracking systems, absolute privacy glass partitions, and specialized secure satellite routing.
              </p>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold mt-6 block">
              Certified Safety Protocols
            </span>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-luxury-gold/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-white mb-3">
                Dubai VIP Cabin Indulgence
              </h4>
              <p className="text-white/80 text-xs font-light leading-relaxed">
                Recline into customized starlight headliners, full temperature champagne bars, massage seating, and integrated premium surround sound options.
              </p>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold mt-6 block">
              Dubai VIP Standard
            </span>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-luxury-gold/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-luxury-gold/10 border border-luxury-gold/25 flex items-center justify-center text-luxury-gold mb-6">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-serif font-bold text-white mb-3">
                Award-Winning Host Network
              </h4>
              <p className="text-white/80 text-xs font-light leading-relaxed">
                Our chauffeurs complete high-stakes emergency driving certifications and protocol school to maintain a world-class level of client care.
              </p>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold mt-6 block">
              Certified Elite Team
            </span>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel p-8 md:p-12 rounded-2xl border border-luxury-gold/20 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-luxury-gold/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-luxury-gold/5 rounded-full blur-[80px] pointer-events-none" />

          <span className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-semibold mb-2 block">
            Make A Statement
          </span>
          <h3 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6">
            Reserve Your Elite Journey Today
          </h3>
          <p className="text-white/85 text-xs md:text-sm font-light leading-relaxed max-w-xl mx-auto mb-8">
            Select your premium vehicle, set your destination, and let our professional chauffeur service elevate your travel experience.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 border border-luxury-gold bg-luxury-gold hover:bg-soft-gold text-matte-black text-xs uppercase tracking-widest font-semibold transition-all duration-300 rounded-none shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              Book Now
            </Link>
            <Link
              href="/fleet"
              className="w-full sm:w-auto relative inline-flex items-center justify-center px-8 py-4 border border-white/20 hover:border-white text-xs uppercase tracking-widest font-semibold text-white bg-transparent hover:bg-white/5 transition-all duration-300 rounded-none"
            >
              Explore Fleet
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Video Modal Player Overlay */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-matte-black/98 flex items-center justify-center p-4 md:p-12 backdrop-blur-lg"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden border border-luxury-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col"
            >
              {/* HTML5 Video Player */}
              <video
                ref={modalVideoRef}
                autoPlay
                controls
                src={activeVideo.videoUrl}
                className="w-full h-full object-cover"
                playsInline
              />

              {/* Close Button overlay */}
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 bg-matte-black/80 hover:bg-luxury-gold hover:text-matte-black text-white p-3 rounded-full border border-white/10 transition-colors z-20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title / Duration Bar */}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/95 to-transparent p-4 flex items-center justify-between pointer-events-none text-white/90">
                <div className="pl-2">
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Now Playing
                  </span>
                  <p className="text-sm font-serif font-bold">{activeVideo.title}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
