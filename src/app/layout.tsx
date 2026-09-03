import type { Metadata } from "next";
import Providers from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnIt English — Plataforma de Estudos",
  description: "Acompanhe seus estudos, organize links, vídeos, artigos e mantenha seu streak diário de inglês.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className="bg-surface-900 text-gray-100 antialiased selection:bg-brand-500/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
