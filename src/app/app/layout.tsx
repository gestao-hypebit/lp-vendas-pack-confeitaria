import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Calculadora de Precificação",
  description: "Sua calculadora de precificação para confeitaria.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  appleWebApp: { capable: true, title: "Precificação", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#3B1F17",
  // evita o zoom automático do iPhone ao tocar nos campos
  maximumScale: 1,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
