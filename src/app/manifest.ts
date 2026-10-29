import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jaga Lahan — Buka Lahan Tanpa Bakar",
    short_name: "Jaga Lahan",
    description: "Pendamping petani gambut untuk membuka lahan tanpa bakar.",
    start_url: "/beranda",
    display: "standalone",
    background_color: "#F8FAF7",
    theme_color: "#1B5E3A",
    lang: "id",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

