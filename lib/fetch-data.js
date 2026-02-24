import { getLocale } from "next-intl/server";

export async function fetchData(config) {
  const apiPath = `${process.env.server}/${config?.api}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const res = await fetch(apiPath, {
      signal: controller.signal,
      next: { revalidate: 180 },
      headers: {
        AmsPublickey: process.env.AMS_PUBLIC_KEY,
        lang: config?.locale || (await getLocale()),
      },
    });

    clearTimeout(timeout);

    // console.log(res.status)

    if (res.status === 404) return { status: 404 }; // ❗ Return 404 to indicate not found, instead of throwing

    if (!res.ok) {
      console.error(`API ERROR: ${apiPath}`, res.status);
      return null; // ❗ throw korbo na
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error(`FETCH FAIL: ${apiPath}`, error.message);

    // ❗ Always return null instead of throw
    return null;
  }
}