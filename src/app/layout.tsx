import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";
import FloatingContact from "@/components/FloatingContact";
import { company } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: `${company.name} — Premium Real Estate in Dhaka`, template: `%s — ${company.name}` },
  description: company.about,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">
        <SmoothScroll>
          <Splash />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingContact />
        </SmoothScroll>
      </body>
    </html>
  );
}
