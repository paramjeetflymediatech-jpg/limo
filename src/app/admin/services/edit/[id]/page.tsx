import React from "react";
import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { initDb, LocationService } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditServicePage({ params }: RouteParams) {
  await initDb();
  const { id } = await params;

  const serviceModel = await LocationService.findByPk(id);

  if (!serviceModel) {
    notFound();
  }

  const service = serviceModel.get({ plain: true });

  return (
    <div className="py-6">
      <ServiceForm isEdit={true} initialData={service as any} />
    </div>
  );
}
