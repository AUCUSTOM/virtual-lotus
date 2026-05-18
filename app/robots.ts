import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd =
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_URL?.includes("virtual-lotus.com");

  if (!isProd) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/auth/"] },
    sitemap: "https://www.virtual-lotus.com/sitemap.xml",
    host: "https://www.virtual-lotus.com",
  };
}