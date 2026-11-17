import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// /app NÃO entra em Disallow de propósito: o Google precisa ler o "noindex" da página.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
