import { NextResponse } from "next/server";
// export const dynamic = "force-dynamic";
import { locales } from "@/navigation";

export async function GET() {
  const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || "en";

  const res = await fetch(API_BASE_URL, {
    headers: { AmsPublickey: process.env.AMS_PUBLIC_KEY },
    next: { revalidate: 86400 }, // ISR caching
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
    {
      url: "/help/contact-us",
      priority: 1,
      updated_at: new Date().toISOString(),
    },
    { url: "/help/qna", priority: 1, updated_at: new Date().toISOString() },
  ];

  const sectionPages = ["/products", "/categories"];

  // Only include the most SEO-valuable sorts
  const sortTypes = ["best_selling", "new"];
  const maxPages = 3; // Limit to first 3 pages per sort
  const productsQueryCombos = [];

  // For each important sort type
  sortTypes.forEach((sort) => {
    // Page 1 (with and without page param)
    productsQueryCombos.push({ params: `?sort_type=${sort}`, priority: 0.8 });
    productsQueryCombos.push({
      params: `?sort_type=${sort}&page=1`,
      priority: 0.8,
    });
    // Pages 2 to maxPages
    for (let page = 2; page <= maxPages; page++) {
      productsQueryCombos.push({
        params: `?sort_type=${sort}&page=${page}`,
        priority: 0.7,
      });
    }
  });
  // Plain pagination (no sort)
  for (let page = 1; page <= maxPages; page++) {
    productsQueryCombos.push({ params: `?page=${page}`, priority: 0.7 });
  }

  function getDateOnlyFromISO(dateTimeStr) {
    return new Date(dateTimeStr).toISOString().split("T")[0];
  }

  // Updated function to prevent duplicates
  const generateHreflangLinks = (DOMAIN, languages, DEFAULT_LOCALE, path) => {
    const links = new Map();

    // Add all language variants
    languages.forEach((lang) => {
      const localizedPath = lang.prefix + path;
      links.set(lang.code, `${DOMAIN}${localizedPath}`);
    });

    // Add x-default (default language version)
    links.set("x-default", `${DOMAIN}${path}`);

    // Generate XML links ensuring no duplicates
    return Array.from(links.entries())
      .map(
        ([code, url]) =>
          `<xhtml:link rel="alternate" hreflang="${code}" href="${url}" />`
      )
      .join("\n");
  };

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
          xmlns:xhtml="http://www.w3.org/1999/xhtml">

    <!-- Static Pages -->
    ${languages
      .map((lang) => {
        return staticPages
          .map((page) => {
            const localizedPath = lang.prefix + page.url;
            return `
        <url>
          <loc>${DOMAIN}${localizedPath}</loc>
          ${generateHreflangLinks(localizedPath)}
          <changefreq>monthly</changefreq>
          <priority>${page.priority}</priority>
          <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
        </url>`;
          })
          .join("");
      })
      .join("")}

    <!-- Localized Section Pages -->
    ${sectionPages
      .map(
        (section) => `
      ${languages
        .map((lang) => {
          const localizedPath = lang.prefix + section;
          return `
        <url>
          <loc>${DOMAIN}${localizedPath}</loc>
          ${generateHreflangLinks(section)}
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
          <lastmod>${getDateOnlyFromISO(new Date().toISOString())}</lastmod>
        </url>`;
        })
        .join("")}
    `
      )
      .join("")}

    <!-- CMS Pages -->
    ${pages
      .map((page) => {
        const path = `/${page.type === "blog" ? "blogs" : "pages"}/${
          page.slug
        }`;
        return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>weekly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

    <!-- Products -->
    ${products
      .map((product) => {
        const path = `/products/${product.slug}`;
        return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
        <changefreq>weekly</changefreq>
        <priority>${product.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
      </url>`;
      })
      .join("")}

    <!-- Categories -->
    ${categories
      .map((category) => {
        const path = `/categories/${category.slug}-${category.id}`;
        return `
      <url>
        <loc>${DOMAIN}${path}</loc>
        ${generateHreflangLinks(path)}
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
