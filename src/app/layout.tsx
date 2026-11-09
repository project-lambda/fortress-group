import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Splash from "@/components/Splash";
import FloatingContact from "@/components/FloatingContact";
import ScrollToTop from "@/components/ScrollToTop";
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
    <html lang="en" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* apply a saved light theme before first paint; dark is the default */}
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('fg:theme')==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}" }} />
      </head>
      <body className="grain">
        <SmoothScroll>
          <Splash />
          <ScrollToTop />
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingContact />
        </SmoothScroll>
      </body>
    </html>
  );
}
