import { getLocale } from "next-intl/server";

export async function fetchData(config, retry = 1) {
  const apiPath = `${process.env.server}/${config?.api}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(apiPath, {
      signal: controller.signal,
      next: { revalidate: config?.revalidate ?? 3600 },
      headers: {
        AmsPublickey: process.env.AMS_PUBLIC_KEY,
        lang: config?.locale || (await getLocale()),
      },
    });

    clearTimeout(timeout);

    if (!res.ok) throw new Error("API Error");

    return await res.json();
  } catch (error) {
    // Retry logic for transient errors
    if (retry > 0) {
      console.log("Retrying API...");
      return fetchData(config, retry - 1);
    }

    console.error(`FINAL FAIL: ${apiPath}`);
    return null;
  }
}