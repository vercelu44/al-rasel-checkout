import { NextResponse } from "next/server";

export async function GET() {
  const API_BASE_URL = `${process.env.API_BASE_URL}/sitemap-data`;
  const DOMAIN = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${API_BASE_URL}`, {
    headers: {
      AmsPublickey: process.env.AMS_PUBLIC_KEY,
    },
  });

  const data = await res.json();
  const staticPages = [
    {
      url: "/help/contact-us",
      priority: 1,
      updated_at: new Date().toISOString(),
    },
    { url: "/help/qna", priority: 1, updated_at: new Date().toISOString() },
  ];

  function getDateOnlyFromISO(dateTimeStr) {
    let normalized = dateTimeStr.includes(" ")
      ? dateTimeStr.replace(" ", "T")
      : dateTimeStr;
    const date = new Date(normalized);
    return date.toISOString().split("T")[0];
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


       ${data.data.pages
        .map(
          (page) => `
      <url>
        <loc>${DOMAIN}${page.type === "blog" ? "/blogs/" : "/"}${
            page.slug
          }</loc>
        <changefreq>weekly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`
        )
        .join("")}
    ${staticPages
      .map(
        (page) => `
      <url>
        <loc>${DOMAIN}${page.url}</loc>
        <changefreq>monthly</changefreq>
        <priority>${page.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(page.updated_at)}</lastmod>
      </url>`
      )
      .join("")}

    ${data.data.products
      .map(
        (product) => `  
      <url>
        <loc>${DOMAIN}/products/${product.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>${product.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(product.updated_at)}</lastmod>
      </url>`
      )
      .join("")}

    ${data.data.categories
      .map(
        (category) => `
      <url>
        <loc>${DOMAIN}/categories/${category.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>${category.priority || 1}</priority>
        <lastmod>${getDateOnlyFromISO(category.updated_at)}</lastmod>
      </url>`
      )
      .join("")}


  </urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
