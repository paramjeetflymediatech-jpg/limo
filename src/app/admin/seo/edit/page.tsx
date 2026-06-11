"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SeoForm, { SeoEntry } from "@/components/admin/SeoForm";
import { AlertCircle } from "lucide-react";

export default function EditSeoPage() {
  const searchParams = useSearchParams();
  const routeParam = searchParams.get("route");
  
  const [data, setData] = useState<SeoEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!routeParam) {
      setError("No route specified for editing.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        const res = await fetch("/api/seo");
        if (!res.ok) throw new Error("Failed to load SEO data");
        const allSeo = await res.json();
        
        if (allSeo[routeParam]) {
          setData({ route: routeParam, ...allSeo[routeParam] });
        } else {
          setError(`SEO configuration for route "${routeParam}" not found.`);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [routeParam]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-2 border-[#D0A511] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <span className="font-semibold">{error}</span>
      </div>
    );
  }

  return <SeoForm initialData={data} isEdit={true} />;
}
