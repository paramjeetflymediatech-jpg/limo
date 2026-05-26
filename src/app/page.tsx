import { getDbSeoMetadata, initDb, FleetItem, LocationService } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

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

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDbSeoMetadata("/");
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: seo.canonicalUrl ? {
      canonical: seo.canonicalUrl,
    } : undefined,
    openGraph: {
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || seo.title,
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    }
  };
}

export default async function Home() {
  await initDb();
  
  // Fetch active fleet from MySQL
  const fleetModels = await FleetItem.findAll({
    where: { available: true }
  });
  
  // Convert to plain JSON objects for clean prop passing
  const fleet = fleetModels.map((car) => car.get({ plain: true }));

  // Fetch active services from MySQL
  const serviceModels = await LocationService.findAll({
    where: { available: true }
  });
  
  // Convert to plain JSON objects for clean prop passing
  const services = serviceModels.map((s) => s.get({ plain: true }));

  return (
    <div className="overflow-x-hidden">
      {/* 1. Cinematic Hero Section */}
      <Hero />

      {/* 2. Premium Stats Section */}
      <Stats />

      {/* 3. Luxury Fleet Showcase */}
      <FleetShowcase fleet={fleet} />

      {/* Cinematic Preview Video Section */}
      <VideoSection />

      {/* 4. Capabilities & Services Section */}
      <Services services={services} />


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
