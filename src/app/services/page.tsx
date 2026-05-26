import { getDbSeoMetadata, initDb, LocationService } from "@/lib/db";
import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDbSeoMetadata("/services");
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

export default async function ServicesPage() {
  await initDb();
  
  const serviceModels = await LocationService.findAll({
    where: { available: true }
  });
  
  const services = serviceModels.map((s) => s.get({ plain: true }));
  
  return <ServicesClient services={services} />;
}

