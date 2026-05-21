import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NexusAI — Machine Speed. Human Soul.",
  description: "The AI platform for the next generation of builders. Sub-2ms inference, infinite context, and adaptive intelligence that learns your domain.",
  keywords: "AI platform, machine learning, artificial intelligence, inference, NexusAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
