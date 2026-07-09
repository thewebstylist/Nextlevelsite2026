import type { Metadata, Viewport } from "next";
import { Michroma, Space_Grotesk, Inter } from "next/font/google";
import { BRAND, SITE_URL } from "./config";
import "./globals.css";

const logoFont = Michroma({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const description =
  "Sterling Creations Ai — Next Level Ai Assisted Client Content Creation. Visual brand identity, Ai-enhanced copywriting, motion & video, interactive experiences and content strategy from Pasadena, CA.";

export const metadata: Metadata = {
  title: `${BRAND.name.toUpperCase()} — ${BRAND.tagline}`,
  description,
  keywords:
    "AI content creation, visual brand identity, AI copywriting, text to video, video translation, content strategy, Sterling Creations, The Web Stylist, Pasadena",
  openGraph: {
    title: `STERLING CREATIONS Ai — ${BRAND.tagline}`,
    description,
    type: "website",
    url: SITE_URL,
    siteName: BRAND.name,
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "Sterling Creations Ai — Next Level Ai Assisted Client Content Creation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `STERLING CREATIONS Ai — ${BRAND.tagline}`,
    description,
    images: [`${SITE_URL}/og.png`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0c" },
  ],
};

// Applies the saved theme before first paint so there is no flash.
// Light is the default when nothing has been saved.
const themeInit = `(function(){try{var t=localStorage.getItem("sc-theme");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light")}catch(e){document.documentElement.setAttribute("data-theme","light")}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${logoFont.variable} ${displayFont.variable} ${bodyFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
