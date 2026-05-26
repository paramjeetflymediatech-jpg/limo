import { getDbSeoMetadata } from "@/lib/db";
import type { Metadata } from "next";
import VideoClient from "./VideoClient";

export const dynamic = "force-dynamic";


export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDbSeoMetadata("/video");
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

export default function VideoTourPage() {
  return <VideoClient />;
}
