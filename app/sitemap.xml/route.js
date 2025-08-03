import { NextResponse } from "next/server";
import { locales } from "@/navigation";

export async function GET() {
  const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL;
  const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";

  const res = await fetch(`${API_BASE_URL}`, {
    headers: { AmsPublickey: process.env.AMS_PUBLIC_KEY },
  });
  const data = await res.json();

  const languages = locales.map((code) => ({
    code,
    prefix: code === DEFAULT_LOCALE ? "" : `/${code}`,
  }));

  const staticPages = [
    { url: "/", priority: 1, updated_at: new Date().toISOString() },
    { url: "/help/contact-us", priority: 1, updated_at: new Date().toISOString() },
    { url: "/help/qna", priority: 1, updated_at: new Date().toISOString() },
  ];

  function getDateOnlyFromISO(dateTimeStr) {
    let normalized = dateTimeStr.includes(" ") ? dateTimeStr.replace(" ", "T") : dateTimeStr;
    return new Date(normalized).toISOString().split("T")[0];
  }

  function generateHreflangLinks(path) {
    const links = languages.map((lang) => {
      const localizedPath = path === "/" && lang.code === DEFAULT_LOCALE 
        ? "/" 
        : `${lang.prefix}${path}`;
      return `<xhtml:link rel="alternate" hreflang="${lang.code}" href="${DOMAIN}${localizedPath}" />`;
    });
    
    const xDefaultPath = path === "/" ? "/" : path;
    links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${DOMAIN}${xDefaultPath}" />`);
    
    return links.join("\n");
  }

  function canonicalUrl(path, langCode = DEFAULT_LOCALE) {
    if (langCode === DEFAULT_LOCALE) {
      return path.startsWith('/') ? path : `/${path}`;
    }
    return `/${langCode}${path.startsWith('/') ? path : `/${path}`}`;
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">

    ${staticPages.map((page) => {
      const path = page.url;
      return `
      <url>
        <loc>${DOMAIN}${path === "/" ? "" : path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>monthly</changefreq>
        <priority>${page.priority}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
    }).join("")}

    ${data.data.pages.map((page) => {
      const pagePath = `/${page.type === "blog" ? "blogs" : "pages"}/${page.slug}`;
      return `
      <url>
        <loc>${DOMAIN}${pagePath}</loc>
        ${generateHreflangLinks(pagePath)}
        <changefreq>weekly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
    }).join("")}

    ${data.data.products.map((product) => {
      const prodPath = `/products/${product.slug}`;
      return `
      <url>
        <loc>${DOMAIN}${prodPath}</loc>
        ${generateHreflangLinks(prodPath)}
        <changefreq>weekly</changefreq>
        <priority>${product.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
      </url>`;
    }).join("")}

    ${data.data.categories.map((category) => {
      const catPath = `/categories/${category.slug}-${category.id}`;
      return `
      <url>
        <loc>${DOMAIN}${catPath}</loc>
        ${generateHreflangLinks(catPath)}
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