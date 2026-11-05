import type { Metadata, Viewport } from "next";
import { DM_Sans, Shrikhand } from "next/font/google";
import Script from "next/script";
import { CheckoutTracking } from "@/components/CheckoutTracking";
import { CONFIG } from "@/config";
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

// URL absoluta para a imagem do Open Graph. Na Vercel é preenchida sozinha;
// NEXT_PUBLIC_SITE_URL é opcional (ex.: domínio próprio).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Pack 30 Posts para Confeitaria — editáveis no Canva",
  description:
    "30 posts prontos para confeitarias e docerias venderem mais no Instagram. Editáveis no Canva: troque a foto, o texto e poste.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Pack 30 Posts para Confeitaria",
    description: "30 posts prontos e editáveis no Canva para sua confeitaria vender mais.",
    images: [{ url: "/img/post-01.jpg", width: 540, height: 675, alt: "Post: Novidade no cardápio" }],
  },
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
