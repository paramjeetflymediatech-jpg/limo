"use client";

import React, { useEffect, useState } from "react";
import { Globe, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type SeoEntry = {
  route: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
};

export default function SeoListPage() {
  const [seoList, setSeoList] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSeo = async () => {
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      // Data is a Record<string, SeoEntry> object right now
      const list = Object.keys(data).map(key => ({
        route: key,
        ...data[key]
      }));
      setSeoList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSeo();
  }, []);

  const handleDelete = async (route: string) => {
    if (!confirm(`Delete SEO for route "${route}"?`)) return;
    try {
      const res = await fetch(`/api/seo?route=${encodeURIComponent(route)}`, { method: "DELETE" });
      if (res.ok) {
        setSeoList(seoList.filter(s => s.route !== route));
      } else {
        alert("Failed to delete SEO route.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting SEO route.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Globe className="w-6 h-6 text-luxury-gold" />
        <h1 className="text-2xl font-serif font-bold text-white">SEO Pages</h1>
        <Link 
          href="/admin/seo/new" 
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-luxury-gold text-matte-black text-[10px] uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all shadow-[0_0_15px_rgba(208,165,17,0.15)]"
        >
          <Plus className="w-3.5 h-3.5" /> Add New Page
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Route</th>
                <th className="px-6 py-4 font-semibold">Page Title</th>
                <th className="px-6 py-4 font-semibold">Meta Description</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading configurations...</td>
                </tr>
              ) : seoList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No SEO configurations found. Click 'Add New Page' to create one.</td>
                </tr>
              ) : (
                seoList.map((item) => (
                  <tr key={item.route} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-900 font-medium">
                      {item.route}
                    </td>
                    <td className="px-6 py-4">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 truncate max-w-xs" title={item.description}>
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/seo/edit?route=${encodeURIComponent(item.route)}`}
                          className="p-1.5 text-gray-400 hover:text-[#D0A511] bg-gray-50 hover:bg-[#D0A511]/10 rounded transition-colors"
                          title="Edit Route"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.route)}
                          className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded transition-colors"
                          title="Delete Route"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
