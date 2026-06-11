import { getDbSeoMetadata } from "@/lib/db";
import type { Metadata } from "next";
import BecomePartnerClient from "@/app/become-a-partner/BecomePartnerClient";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getDbSeoMetadata("/become-a-partner");
  return {
    title: seo.title || "Become a Partner | Fantastic Limo",
    description: seo.description || "Partner with Fantastic Limo for elite B2B transportation solutions.",
    keywords: seo.keywords || "partnership, b2b transport, luxury affiliate, limo network",
    alternates: seo.canonicalUrl ? {
      canonical: seo.canonicalUrl,
    } : undefined,
    openGraph: {
      title: seo.ogTitle || seo.title || "Become a Partner | Fantastic Limo",
      description: seo.ogDescription || seo.description || "Join our exclusive network of global affiliates and luxury travel partners.",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.ogTitle || seo.title || "Become a Partner | Fantastic Limo",
      description: seo.ogDescription || seo.description,
      images: seo.ogImage ? [seo.ogImage] : undefined,
    }
  };
}

export default function BecomePartnerPage() {
  return <BecomePartnerClient />;
}
