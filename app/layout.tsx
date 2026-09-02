import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cacapp.app"),
  title: "CacApp — Le journal de vos passages",
  description: "Notez vos passages, suivez votre rythme et collectionnez vos exploits avec CacApp.",
  openGraph: {
    title: "CacApp — Le journal du trône",
    description: "Suivez. Comprenez. Progressez.",
    type: "website",
    locale: "fr_FR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CacApp — Le journal du trône" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CacApp — Le journal du trône",
    description: "Suivez. Comprenez. Progressez.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
