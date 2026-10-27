import { getLocale } from "next-intl/server";

export interface FetchDataConfig {
	/** Path after the API base URL, e.g. `products/my-slug` */
	api: string;
	/** Sent as the `lang` header. Defaults to the current request locale. */
	locale?: string;
	/** Cache lifetime in seconds (ISR). Default: 1200 */
	revalidate?: number;
}

/**
 * GET request from Server Components.
 * Returns the parsed JSON, or `null` if the request fails (it never throws).
 *
 * @example
 * const res = await fetchData<ApiResponse<Product>>({ api: `products/${slug}` });
 * const product = res?.data;
 */
export async function fetchData<T = unknown>(
	config: FetchDataConfig,
	retry = 1
): Promise<T | null> {
	const apiPath = `${process.env.server}/${config?.api}`;


	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15000);

		const res = await fetch(apiPath, {
			signal: controller.signal,
			next: {
				revalidate: config?.revalidate ?? 1200,
			},
			headers: {
				AmsPublickey: process.env.AMS_PUBLIC_KEY,
				lang: config?.locale || (await getLocale()),
			},
		});

		clearTimeout(timeout);

		if (!res.ok) {
      console.error("API FAILED:", {
        url:apiPath,
        status: res.status,
      });

      return null;
    }

    return (await res.json()) as T;
	} catch (error) {
		 console.error("API FETCH ERROR:", {
      url:apiPath,
      message: error?.message,
    });

    return null;
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
//       next: { revalidate: config?.revalidate ?? 1200 },
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
