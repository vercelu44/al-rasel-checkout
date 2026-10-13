import { getLocale } from "next-intl/server"; // like `useLocale`

/**
 * This is an asynchronous function that fetches data from an API using the provided configuration and
 * returns the data.
 * @param config - The `config` parameter is an object that contains the configuration options for the
 * `fetchData` function. It may contain the following properties:
 * @returns The `fetchData` function is returning the `data` fetched from the API endpoint specified in
 * the `config` parameter. If there is an error during the fetch, it will throw an error with the
 * message "Failed to fetch data".
 */

export async function fetchData(config, retry = 1) {
  const apiPath = `${process.env.server}/${config?.api}`;

  try {
    let lang = config?.locale;
    if (!lang) {
      try {
        lang = await getLocale();
      } catch (localeErr) {
        lang = process.env.DEFAULT_LOCALE || "en";
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(apiPath, {
      signal: controller.signal,
      next: { revalidate: config?.revalidate ?? 3600 },
      headers: {
        AmsPublickey: process.env.AMS_PUBLIC_KEY || process.env.amsPublickey,
        lang: lang || "en",
      },
    });

    clearTimeout(timeout);

    // If 404 Not Found, don't retry and don't treat as server error
    if (res.status === 404) {
      return { data: null, status: 404 };
    }

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    return await res.json();
  } catch (error) {
    // Retry logic for transient errors (network / 5xx)
    if (retry > 0) {
      console.log(`Retrying API: ${apiPath}...`);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fetchData(config, retry - 1);
    }

    console.error(`FINAL FAIL: ${apiPath} - ${error?.message}`);
    return { data: null, error: true };
  }
}

// import { getLocale } from "next-intl/server";

// export async function fetchData(config, retry = 1) {
//   const apiPath = `${process.env.server}/${config?.api}`;

//   try {
//     const controller = new AbortController();
//     const timeout = setTimeout(() => controller.abort(), 15000);

//     const res = await fetch(apiPath, {
//       signal: controller.signal,
//       next: { revalidate: config?.revalidate ?? 3600 },
//       headers: {
//         AmsPublickey: process.env.AMS_PUBLIC_KEY,
//         lang: config?.locale || (await getLocale()),
//       },
//     });

//     clearTimeout(timeout);

//     if (!res.ok) throw new Error("API Error");

//     return await res.json();
//   } catch (error) {
//     // Retry logic for transient errors
//     if (retry > 0) {
//       console.log("Retrying API...");
//       return fetchData(config, retry - 1);
//     }

//     console.error(`FINAL FAIL: ${apiPath}`);
//     return null;
//   }
// }