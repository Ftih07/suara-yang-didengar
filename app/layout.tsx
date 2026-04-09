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
  // Title & Description (Wajib untuk Google Search)
  title: "Suara Yang Didengar | Game Simulasi Kepala Desa",
  description:
    "Jadilah Kepala Desa yang bijak! Game simulasi interaktif tentang kepemimpinan, musyawarah, dan keadilan sosial di lingkungan pedesaan.",

  // Keywords (Opsional tapi bagus untuk konteks)
  keywords: [
    "game edukasi",
    "simulasi kepala desa",
    "game musyawarah",
    "suara yang didengar",
    "game pkn",
    "game visual novel indonesia",
  ],

  // Open Graph (Untuk preview cakep pas di-share di WhatsApp, Discord, FB)
  openGraph: {
    title: "Suara Yang Didengar - Game Simulasi Desa",
    description:
      "Ambil keputusan sulit sebagai Kepala Desa. Apakah kamu bisa menjaga kepercayaan warga dan kas desa?",
    url: "https://suara.digitify.my.id/characters/kades-normal.png", // Nanti ganti dengan URL aslinya kalau udah deploy
    siteName: "Suara Yang Didengar",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://suara.digitify.my.id/characters/kades-normal.png", // Nanti siapkan gambar thumbnail
        width: 1200,
        height: 630,
        alt: "Suara Yang Didengar Thumbnail",
      },
    ],
  },

  // Twitter Card (Untuk preview pas di-share di Twitter/X)
  twitter: {
    card: "summary_large_image",
    title: "Suara Yang Didengar",
    description: "Game simulasi kepemimpinan desa. Berani ambil keputusan?",
    images: ["https://suara.digitify.my.id/characters/kades-normal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
