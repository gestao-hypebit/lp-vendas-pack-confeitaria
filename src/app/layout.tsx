import type { Metadata, Viewport } from "next";
import { DM_Sans, Shrikhand } from "next/font/google";
import Script from "next/script";
import { CheckoutTracking } from "@/components/CheckoutTracking";
import { CONFIG } from "@/config";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Shrikhand({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-sans",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Calculadora de Precificação para Confeitaria",
  description:
    "Descubra em 2 minutos se você está perdendo dinheiro em cada doce. Ingredientes, embalagem, gás, sua hora e taxas do iFood, direto do celular.",
};

export const viewport: Viewport = {
  themeColor: "#3B1F17",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body>
        {children}
        <CheckoutTracking />
        {CONFIG.pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
            document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${CONFIG.pixelId}');
            fbq('track', 'PageView');
          `}</Script>
        )}
      </body>
    </html>
  );
}
