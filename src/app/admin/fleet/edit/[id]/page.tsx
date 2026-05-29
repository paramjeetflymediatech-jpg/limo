import React from "react";
import { notFound } from "next/navigation";
import FleetForm from "@/components/admin/FleetForm";
import { initDb, Fleet } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditFleetPage({ params }: RouteParams) {
  await initDb();
  const { id } = await params;

  const vehicleModel = await Fleet.findByPk(id);

  if (!vehicleModel) {
    notFound();
  }

  const vehicle = vehicleModel.get({ plain: true });

  return (
    <div className="py-6">
      <FleetForm isEdit={true} initialData={vehicle as any} />
    </div>
  );
}
