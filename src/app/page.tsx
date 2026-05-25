import Hero from "@/components/home/Hero";
import Stats from "@/components/home/Stats";
import FleetShowcase from "@/components/home/FleetShowcase";
import Services from "@/components/home/Services";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import Experience from "@/components/home/Experience";
import Gallery from "@/components/home/Gallery";
import BookingCTA from "@/components/home/BookingCTA";
import VideoSection from "@/components/home/VideoSection";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Premium Stats Section */}
      <Stats />

      {/* 3. Luxury Fleet Showcase */}
      <FleetShowcase />

      {/* Cinematic Preview Video Section */}
      <VideoSection />

      {/* 4. Capabilities & Services Section */}
      <Services />

      {/* 5. Why Choose Us Section */}
      <WhyChooseUs />

      {/* 6. Testimonial Endorsements Slider */}
      <Testimonials />

      {/* 7. Experience Banner Section */}
      <Experience />

      {/* 8. Instagram / Lifestyle Gallery Section */}
      <Gallery />

      {/* 9. Booking CTA Banner */}
      <BookingCTA />
    </div>
  );
}
