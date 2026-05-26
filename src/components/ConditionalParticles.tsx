"use client";

import { usePathname } from "next/navigation";
import ParticlesBackground from "@/components/ParticlesBackground";

export default function ConditionalParticles() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <ParticlesBackground />;
}
