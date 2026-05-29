import { initDb, LocationService } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

import DynamicChauffeurDetailsClient from "./DynamicChauffeurDetailsClient";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// Dynamic Metadata generator for SEO synchrony
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  await initDb();
  const { slug } = await params;

  const service = await LocationService.findOne({
    where: { slug, available: true }
  });

  if (!service) {
    return {
      title: "Service Not Found | FantasticLimo Experiences",
    };
  }

  return {
    title: `${service.name} | FantasticLimo ${service.location}`,
    description: service.description,
    openGraph: {
      title: `${service.name} | FantasticLimo ${service.location}`,
      description: service.description,
      images: [{ url: service.image }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.name} | FantasticLimo ${service.location}`,
      description: service.description,
      images: [service.image],
    }
  };
}

export default async function ServiceDetailPage({ params }: RouteParams) {
  await initDb();
  const { slug } = await params;

  const serviceModel = await LocationService.findOne({
    where: { slug, available: true }
  });

  if (!serviceModel) {
    notFound();
  }

  const service = serviceModel.get({ plain: true });

  // Safe JSON Parsing helper
  let bulletPointsList: string[] = [];
  try {
    bulletPointsList = JSON.parse(service.bulletPoints);
  } catch (e) {
    // Fallback if formatting is corrupted
    bulletPointsList = [
      "Bespoke timing and schedule configurations",
      "Professional uniform chauffeur service included",
      "Executive premium fleet availability",
      "Onboard mineral water and charging access"
    ];
  }

  let featuresGridList: { title: string; description: string }[] = [];
  try {
    featuresGridList = JSON.parse(service.featuresJson);
  } catch (e) {
    featuresGridList = [
      { title: "Bespoke Comfort", description: "Meticulous interior detailing and climate controls configured for comfort." },
      { title: "Professional Protocol", description: "Chauffeur trained to international standards and protocol guidelines." },
      { title: "Quiet Cabin", description: "Privacy glass parameters and clean styling for executive transport." },
      { title: "VIP Desk Coordination", description: "24/7 coordinator support to monitor routing shifts and waypoint updates." }
    ];
  }

  // Map icon names (strings) so they can safely cross the Server→Client boundary
  const iconNames = ["Compass", "Clock", "BadgeCheck", "ShieldAlert", "Shield", "Briefcase", "Award", "Sparkles", "Heart", "Star"];

  const processedFeatures = featuresGridList.map((feat, idx) => ({
    ...feat,
    icon: iconNames[idx % iconNames.length],
  }));

  return (
    <div className="bg-matte-black min-h-screen py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Breadcrumb / Back Link */}
        <Link
          href="/services"
          className="text-xs uppercase tracking-widest text-luxury-gold hover:text-white mb-8 inline-block transition-colors"
        >
          &larr; Back to Services
        </Link>

        {/* Hero Row */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-24">
          <div className="w-full lg:w-1/2">
            <span className="text-xs uppercase tracking-[0.35em] text-luxury-gold font-semibold mb-3 block">
              {service.tagline || `Exclusive ${service.location} Chauffeur`}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
              {service.name}
            </h1>
            <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
              {service.description}
            </p>
            
            <div className="flex flex-col gap-3 mb-8">
              {bulletPointsList.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-gray-300">
                  <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            
            <Link
              href={`/booking?service=${encodeURIComponent(service.name)}&location=${encodeURIComponent(service.location)}`}
              className="inline-flex px-8 py-4 bg-gradient-to-r from-luxury-gold to-soft-gold text-matte-black font-semibold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300"
            >
              Book Chauffeur in {service.location}
            </Link>
          </div>

          <div className="w-full lg:w-1/2 relative h-[300px] md:h-[450px] overflow-hidden rounded-lg border border-luxury-gold/15 shadow-2xl bg-matte-black">
            {service.image ? (
              <Image
                src={service.image}
                alt={service.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized
                className="object-cover brightness-75"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                <span className="text-luxury-gold text-xs uppercase tracking-widest opacity-50">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid Client Animation Wrapper */}
        <DynamicChauffeurDetailsClient features={processedFeatures} />
      </div>
    </div>
  );
}