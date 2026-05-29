import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import LoadingScreen from "@/components/LoadingScreen";
export const dynamic = "force-dynamic";
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
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
      className={`${cormorant.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-matte-black text-white relative">
        {/* Loading Screen */}
        <LoadingScreen />

        {/* Cinematic Film Grain / Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* Conditional Layout Wrapper */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
