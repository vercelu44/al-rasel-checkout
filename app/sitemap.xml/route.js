import { NextResponse } from "next/server";
import { locales } from "@/navigation"; // Adjust path to your navigation file

export async function GET() {
  const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL;

  // Fetch dynamic data
  const res = await fetch(`${API_BASE_URL}`, {
    headers: {
      AmsPublickey: process.env.AMS_PUBLIC_KEY,
    },
  });

  const data = await res.json();

  const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";

  // Build language config dynamically
  const languages = locales.map((code) => ({
    code,
    prefix: code === DEFAULT_LOCALE ? "" : `/${code}`,
  }));

  const staticPages = [
    { url: "/", priority: 1, updated_at: new Date().toISOString() }, // English homepage
    {
      url: "/help/contact-us",
      priority: 1,
      updated_at: new Date().toISOString(),
    },
    { url: "/help/qna", priority: 1, updated_at: new Date().toISOString() },
    { url: "/bn", priority: 1, updated_at: new Date().toISOString() }, // Bangla homepage
    { url: "/ar", priority: 1, updated_at: new Date().toISOString() }, // Arabic homepage
  ];

  function getDateOnlyFromISO(dateTimeStr) {
    let normalized = dateTimeStr.includes(" ")
      ? dateTimeStr.replace(" ", "T")
      : dateTimeStr;
    const date = new Date(normalized);
    return date.toISOString().split("T")[0];
  }

  function generateHreflangLinks(path) {
    return (
      languages
        .map((lang) => {
          const localizedPath = `${DOMAIN}${lang.prefix}${path}`;
          return `<xhtml:link rel="alternate" hreflang="${lang.code}" href="${localizedPath}" />`;
        })
        .join("\n") +
      `\n<xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${path}" />`
    );
  }

  // Helper to get canonical path (always default locale, no prefix)
  function canonicalUrl(path) {
    // Remove default locale prefix if exists (should not be present)
    if (path.startsWith(`/${DEFAULT_LOCALE}`)) {
      return path.slice(DEFAULT_LOCALE.length + 1) || "/";
    }
    return path;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">

    ${data.data.pages
      .map((page) => {
        const pagePath = `/${page.type === "blog" ? "blogs" : "pages"}/${
          page.slug
        }`;
        const canonicalPath = canonicalUrl(pagePath);
        return `
      <url>
        <loc>${DOMAIN}${canonicalPath}</loc>
        ${generateHreflangLinks(pagePath)}
        <changefreq>weekly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

    ${staticPages
      .map((page) => {
        const path = page.url === "/" ? "/" : page.url;
        const canonicalPath = canonicalUrl(path);
        return `
      <url>
        <loc>${DOMAIN}${canonicalPath}</loc>
        ${generateHreflangLinks(path === "/" ? "" : path)}
        <changefreq>monthly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

    ${data.data.products
      .map((product) => {
        const prodPath = `/products/${product.slug}`;
        const canonicalPath = canonicalUrl(prodPath);
        return `
      <url>
        <loc>${DOMAIN}${canonicalPath}</loc>
        ${generateHreflangLinks(prodPath)}
        <changefreq>weekly</changefreq>
        <priority>${product.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

    ${data.data.categories
      .map((category) => {
        const catPath = `/categories/${category.slug}`;
        const canonicalPath = canonicalUrl(catPath);
        return `
      <url>
        <loc>${DOMAIN}${canonicalPath}</loc>
        ${generateHreflangLinks(catPath)}
        <changefreq>weekly</changefreq>
        <priority>${category.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(category.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
