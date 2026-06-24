import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RŌNIN — Game Development Studio · We Forge Worlds",
  description:
    "RŌNIN is an independent game development studio crafting cinematic, soul-driven worlds. Original IP, work-for-hire, art direction, and engine craft from concept to launch.",
  keywords:
    "game development studio, indie games, game design, 3D art, game art direction, RŌNIN, narrative design, video game studio",
  openGraph: {
    title: "RŌNIN — We Forge Worlds",
    description:
      "An independent game development studio crafting cinematic, soul-driven worlds.",
    type: "website",
  },
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
