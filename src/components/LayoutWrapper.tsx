"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {/* Custom Cursor for VIP experience */}
      <CustomCursor />
      
      {/* Dynamic Navigation */}
      <Navbar />
      
      {/* Smooth momentum scrolling */}
      <SmoothScroll>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow pt-[88px]">{children}</main>
          <Footer />
        </div>
      </SmoothScroll>
      
      {/* Float Contact Link */}
      <WhatsAppButton />
    </>
  );
}
