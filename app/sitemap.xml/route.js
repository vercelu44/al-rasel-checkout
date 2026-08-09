import { NextResponse } from "next/server";

function escapeXml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getDateOnlyFromISO(dateTimeStr) {
  if (!dateTimeStr) {
    return new Date().toISOString().split("T")[0];
  }

  const normalized = dateTimeStr.includes(" ")
    ? dateTimeStr.replace(" ", "T")
    : dateTimeStr;

  const date = new Date(normalized);

  if (isNaN(date.getTime())) {
    return new Date().toISOString().split("T")[0];
  }

  return date.toISOString().split("T")[0];
}

export async function GET() {
  try {
    const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
    const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

    const res = await fetch(API_BASE_URL, {
      headers: {
        AmsPublickey: process.env.AMS_PUBLIC_KEY ?? "",
      },
      next: {
        revalidate: 60 * 60 * 24,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap data (${res.status})`);
    }

    const data = await res.json();

    const staticPages = [
      {
        url: "/help/contact-us",
        priority: 1,
        updated_at: new Date().toISOString(),
      },
      {
        url: "/help/qna",
        priority: 1,
        updated_at: new Date().toISOString(),
      },
    ];

    const pages = data?.data?.pages ?? [];
    const products = data?.data?.products ?? [];
    const categories = data?.data?.categories ?? [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${pages
  .map(
    (page) => `
  <url>
    <loc>${escapeXml(
      `${DOMAIN}/${page.type === "blog" ? "blogs" : "pages"}/${page.slug}`,
    )}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority ?? 1}</priority>
    <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
  </url>`,
  )
  .join("")}

${staticPages
  .map(
    (page) => `
  <url>
    <loc>${escapeXml(`${DOMAIN}${page.url}`)}</loc>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
  </url>`,
  )
  .join("")}

${products
  .map(
    (product) => `
  <url>
    <loc>${escapeXml(`${DOMAIN}/products/${product.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${product.priority ?? 1}</priority>
    <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
  </url>`,
  )
  .join("")}

${categories
  .map(
    (category) => `
  <url>
    <loc>${escapeXml(`${DOMAIN}/categories/${category.slug}`)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${category.priority ?? 1}</priority>
    <lastmod>${getDateOnlyFromISO(category.updated_at)}</lastmod>
  </url>`,
  )
  .join("")}

</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return new NextResponse("Failed to generate sitemap", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}