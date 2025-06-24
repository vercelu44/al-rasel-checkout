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
  const staticPages = ["/help/contact-us", "/help/qna"];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">


      ${data.data.pages
        .map(
          (page) => `
      <url>
        <loc>${DOMAIN}/${page.type === "blog" ? "blogs" : "pages"}/${
            page.slug
          }</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
        <lastmod>${page.updated_at}</lastmod>
      </url>`
        )
        .join("")}
    ${staticPages
      .map(
        (url) => `
      <url>
        <loc>${DOMAIN}${url}</loc>
        <changefreq>monthly</changefreq>
        <priority>${url === "/" ? 1.0 : 0.8}</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>`
      )
      .join("")}

    ${data.data.products
      .map(
        (product) => `  
      <url>
        <loc>${DOMAIN}/products/${product.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
        <lastmod>${product.updated_at}</lastmod>
      </url>`
      )
      .join("")}

    ${data.data.categories
      .map(
        (category) => `
      <url>
        <loc>${DOMAIN}/categories/${category.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
        <lastmod>${category.updated_at}</lastmod>
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
