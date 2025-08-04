import { NextResponse } from "next/server";
import { locales } from "@/navigation";

export async function GET() {
  const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";

  const res = await fetch(API_BASE_URL, {
    headers: { AmsPublickey: process.env.AMS_PUBLIC_KEY },
    next: { revalidate: 86400 } // ISR caching
  });

  const data = await res.json();

  const pages = data?.data?.pages || [];
  const products = data?.data?.products || [];
  const categories = data?.data?.categories || [];

  const languages = locales.map((code) => ({
    code,
    prefix: code === DEFAULT_LOCALE ? "" : `/${code}`,
  }));

  const staticPages = [
    { url: "/", priority: 1, updated_at: new Date().toISOString() },
    { url: "/help/contact-us", priority: 1, updated_at: new Date().toISOString() },
    { url: "/help/qna", priority: 1, updated_at: new Date().toISOString() },
  ];

  const sectionPages = ["/products", "/categories"]; // Sections to localize

  function getDateOnlyFromISO(dateTimeStr) {
    return new Date(dateTimeStr).toISOString().split("T")[0];
  }

  function generateHreflangLinks(path) {
    const links = languages.map((lang) => {
      const localizedPath = path === "/" && lang.code === DEFAULT_LOCALE 
        ? "/" 
        : `${lang.prefix}${path}`;
      return `<xhtml:link rel="alternate" hreflang="${lang.code}" href="${DOMAIN}${localizedPath}" />`;
    });
    links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${path}" />`);
    return links.join("\n");
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <!-- Static Pages -->
    ${staticPages.map((page) => `
      <url>
        <loc>${DOMAIN}${page.url === "/" ? "" : page.url}</loc>
        ${generateHreflangLinks(page.url)}
        <changefreq>monthly</changefreq>
        <priority>${page.priority}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`).join("")}

    <!-- Localized Section Pages -->
    ${sectionPages.map((section) => `
      ${languages.map((lang) => {
        const localizedPath = lang.prefix + section;
        return `
        <url>
          <loc>${DOMAIN}${localizedPath}</loc>
          ${generateHreflangLinks(section)}
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
          <lastmod>${getDateOnlyFromISO(new Date().toISOString())}</lastmod>
        </url>`;
      }).join("")}
    `).join("")}

    <!-- CMS Pages -->
    ${pages.map((page) => {
      const path = `/${page.type === "blog" ? "blogs" : "pages"}/${page.slug}`;
      return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>weekly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
    }).join("")}

    <!-- Products -->
    ${products.map((product) => {
      const path = `/products/${product.slug}`;
      return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>weekly</changefreq>
        <priority>${product.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
      </url>`;
    }).join("")}

    <!-- Categories -->
    ${categories.map((category) => {
      const path = `/categories/${category.slug}-${category.id}`;
      return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>weekly</changefreq>
        <priority>${category.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(category.updated_at)}</lastmod>
      </url>`;
    }).join("")}

  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
