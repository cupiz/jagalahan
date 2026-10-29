import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jaga Lahan — Buka Lahan Tanpa Bakar",
    template: "%s | Jaga Lahan",
  },
  description:
    "Aplikasi pendamping petani dan pekebun lahan gambut untuk membuka lahan tanpa bakar: kalkulator biaya, panduan 6 tahap, tongkat ukur muka air tanah, dan kohort desa.",
  applicationName: "Jaga Lahan",
  authors: [{ name: "Iqbal Ahdagita Elbadra" }],
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
};

export const viewport: Viewport = {
  themeColor: "#1B5E3A",
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
