"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default function EditBlogPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${id}`)
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || data.error) {
    return <div className="p-8 text-red-500">Blog post not found.</div>;
  }

  return (
    <div className="py-6">
      <BlogForm initialData={data} isEdit />
    </div>
  );
}
