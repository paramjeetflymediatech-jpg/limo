import { getDbSeoMetadata, initDb, FleetItem } from "@/lib/db";
import type { Metadata } from "next";
import FleetClient from "./FleetClient";

export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDbSeoMetadata("/fleet");
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

export default async function FleetPage() {
  await initDb();
  
  const fleetModels = await FleetItem.findAll({
    where: { available: true }
  });
  
  const fleet = fleetModels.map((car) => car.get({ plain: true }));
  
  return <FleetClient fleet={fleet} />;
}
