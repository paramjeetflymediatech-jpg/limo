import { initDb, FleetItem } from "@/lib/db";
import { notFound } from "next/navigation";
import FleetDetailClient from "@/app/fleet/[id]/FleetDetailClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  await initDb();
  
  const car = await FleetItem.findByPk(id);
  if (!car) {
    return {
      title: "Vehicle Not Found | FantasticLimo",
    };
  }

  return {
    title: `${car.name} | Dynamic Fleet Detail | FantasticLimo`,
    description: car.description,
    openGraph: {
      title: `${car.name} | FantasticLimo`,
      description: car.description,
      images: [{ url: car.image }],
    },
  };
}

export default async function FleetDetailPage({ params }: PageProps) {
  const { id } = await params;
  await initDb();

  const carModel = await FleetItem.findByPk(id);
  if (!carModel) {
    notFound();
  }

  const car = carModel.get({ plain: true });

  return <FleetDetailClient car={car} />;
}
