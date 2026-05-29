import React from "react";
import FleetForm from "@/components/admin/FleetForm";

export default function NewFleetPage() {
  return (
    <div className="py-6">
      <FleetForm isEdit={false} />
    </div>
  );
}
