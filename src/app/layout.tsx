import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jagalahan.web.id"),
  title: {
    default: "JagaLahan — Smart Land & Zero-Burning Tracker",
    template: "%s | JagaLahan",
  },
  description:
    "Platform teknologi persuasif pencegahan Karhutla: AI Smart Land & Smoke Scanner, Tracking Manfaat Tanpa Bakar, Check-in Benih Hijau, Pengingat Siaga, dan Tabungan Alat Kebun.",
  applicationName: "JagaLahan",
  authors: [{ name: "Iqbal Ahdagita Elbadra" }],
  alternates: {
    canonical: "https://jagalahan.web.id",
  },
  openGraph: {
    title: "JagaLahan — Smart Land & Zero-Burning Tracker",
    description:
      "Kelola lahan tanpa bakar lebih cerdas, terukur nilai rupiahnya, dan bebas kabut asap bersama JagaLahan.",
    url: "https://jagalahan.web.id",
    siteName: "JagaLahan",
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#042f2e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
