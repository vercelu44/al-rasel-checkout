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
export async function fetchData(config) {
    const apiPath = `${process.env.server}/${config?.api}`;
    try {
        const res = await fetch(apiPath, {
            next: { revalidate: 59 },
            headers: {
                AmsPublickey: process.env.AMS_PUBLIC_KEY,
                lang: config?.locale || (await getLocale()),
            },
        });

        if (!res.ok) {
            // Log the API path, response status, and text for debugging
            const errorDetails = await res.text();
            console.error(`Error fetching data from ${apiPath}: ${res.status} ${res.statusText} - ${errorDetails}`);

            // This will activate the closest `error.js` Error Boundary
            throw new Error(`Failed to fetch data from ${apiPath}: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        return data;

    } catch (error) {
        // Log the API path and error details for debugging
        console.error(`Error in fetchData for ${apiPath}:`, error);

        // Handle specific types of errors if needed
        if (error instanceof SyntaxError) {
            throw new Error(`Failed to parse response data from ${apiPath}`);
        } else if (error instanceof TypeError) {
            throw new Error(`Network error or resource not found at ${apiPath}`);
        }

        // Re-throw the error to be caught by an error boundary or further up the call stack
        throw error;
    }
}
