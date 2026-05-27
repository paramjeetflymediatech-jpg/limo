"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <section className="bg-matte-black theme-dark py-24 relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
            Cinematic Preview
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
            The FantasticLimo Experience in Motion
          </h2>
          <p className="text-white text-sm md:text-base leading-relaxed font-light">
            Take a seat inside our prestige cabins. Catch a glimpse of the precision, privacy, and hospitality delivered by our elite chauffeur network.
          </p>
        </div>

        {/* Video Player Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[300px] md:h-[550px] rounded-xl overflow-hidden border border-luxury-gold/15 group shadow-2xl bg-dark-gray"
        >
          {/* HTML5 Video Player */}
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer brightness-[0.7] group-hover:brightness-[0.8] transition-all duration-500"
          >
            <source
              src="/vid1.mp4"
              type="video/mp4"
            />
          </video>

          {/* Gradient top and bottom overlays */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-matte-black/60 via-transparent to-matte-black/30 pointer-events-none" /> */}

          {/* Play/Pause Center Button Overlay */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-luxury-gold text-matte-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:scale-110 hover:bg-soft-gold transition-all duration-300 z-20"
                aria-label="Play Video"
              >
                <Play className="w-8 h-8 fill-matte-black translate-x-0.5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Bottom Custom Controls Bar */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex items-center justify-between z-20">
            {/* Play/Pause toggle */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-luxury-gold transition-colors flex items-center justify-center p-2 rounded-full bg-matte-black/60 backdrop-blur-sm border border-white/10"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Right side controls (Volume / Fullscreen) */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMute}
                className="text-white hover:text-luxury-gold transition-colors flex items-center justify-center p-2 rounded-full bg-matte-black/60 backdrop-blur-sm border border-white/10"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleFullscreen}
                className="text-white hover:text-luxury-gold transition-colors flex items-center justify-center p-2 rounded-full bg-matte-black/60 backdrop-blur-sm border border-white/10"
                aria-label="Fullscreen"
              >
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
