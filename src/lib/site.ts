// URL absoluta do site (OG, sitemap). Na Vercel é preenchida sozinha;
// NEXT_PUBLIC_SITE_URL é opcional (ex.: domínio próprio).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
