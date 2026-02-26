"use server";

import { getLocale } from "next-intl/server";

export async function fetchProducts(page, config) {
  const apiPath = `${process.env.server}/${config?.api}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(apiPath, {
      signal: controller.signal,
      next: { revalidate: config?.revalidate ?? 3600 },
      headers: {
        AmsPublickey: process.env.AMS_PUBLIC_KEY,
        lang: config?.locale || (await getLocale()),
      },
    });

    clearTimeout(timeout);

    // ✅ Actual 404 (page end case for infinite scroll)
    if (response.status === 404) return { status: 404 };

    // ❗ Other API error
    if (!response.ok) {
      console.error(`API ERROR: ${apiPath}`, response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`FETCH FAIL: ${apiPath}`, error.message);
    return null;
  }
}