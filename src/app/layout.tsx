import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";
import SmoothScroll from "@/components/SmoothScroll";
import ParticlesBackground from "@/components/ParticlesBackground";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FantasticLimo | Luxury Limousine & VIP Transport Service",
    template: "%s | FantasticLimo",
  },
  description: "Experience the pinnacle of luxury, privacy, and safety. FantasticLimo Service offers elite airport transfers, corporate travel, wedding limousines, and VIP logistics worldwide.",
  metadataBase: new URL("https://fantasticlimo.com"),
  openGraph: {
    title: "FantasticLimo | Luxury Limousine & VIP Transport Service",
    description: "Experience the pinnacle of luxury, privacy, and safety. FantasticLimo Service offers elite airport transfers, corporate travel, wedding limousines, and VIP logistics worldwide.",
    url: "https://fantasticlimo.com",
    siteName: "FantasticLimo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FantasticLimo | Luxury Limousine & VIP Transport Service",
    description: "Experience the pinnacle of luxury, privacy, and safety. FantasticLimo Service offers elite airport transfers, corporate travel, wedding limousines, and VIP logistics worldwide.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-matte-black text-white relative">
        {/* Loading Screen */}
        <LoadingScreen />

        {/* Cinematic 3D Particles */}
        <ParticlesBackground />

        {/* Cinematic Film Grain / Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* Custom Cursor */}
        <CustomCursor />
        
        {/* Navigation bar */}
        <Navbar />
        
        {/* Smooth momentum scrolling wrapper */}
        <SmoothScroll>
          <div className="flex flex-col min-h-screen">
            {/* Main Content Area */}
            <main className="flex-grow pt-[88px]">{children}</main>
            
            {/* Footer */}
            <Footer />
          </div>
        </SmoothScroll>
        
        {/* Floating WhatsApp Button */}
        <WhatsAppButton />
      </body>
    </html>
  );
}
