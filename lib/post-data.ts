/**
 * The function `postData` is an asynchronous function that sends a POST request to a server with
 * specified configuration and data, and returns the response as a JSON object.
 * @param config - The `config` parameter is an object that contains the configuration options for the
 * POST request. It can have the following properties:
 * @param [data] - The `data` parameter is an optional object that contains the data to be sent in the
 * request body. It is used to pass any additional information or payload that needs to be sent along
 * with the request.
 * @returns the result of the fetch request, which is a Promise that resolves to the response data as a
 * JSON object.
 */
export interface PostDataConfig {
	/** Path after the API base URL */
	api: string;
	/** Use the private key (server only) instead of the public key. */
	isPrivate?: boolean;
	method?: "POST" | "PUT" | "PATCH" | "DELETE";
	authorization?: string;
}

export async function postData<T = unknown>(
	config: PostDataConfig,
	data: object = {}
): Promise<T & { status?: boolean | number; message?: string }> {
	const headerParams: Record<string, string> = {};
	if (config.isPrivate)
		headerParams.AmsPrivateKey = process.env.AMS_PRIVATE_KEY;
	else headerParams.AmsPublickey = process.env.AMS_PUBLIC_KEY;

	const res = await fetch(`${process.env.server}/${config?.api}`, {
		method: config?.method || "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: config?.authorization || "",
			...headerParams,
		},
		body: JSON.stringify(data),
	});

	// Recommendation: handle errors
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		// console.log(res);
		// throw new Error("Failed to Post/Update data");
		const result = (await res.json()) || {};
		// console.log(result);
		return {
			...result,
			status: false,
		};
	}
	const result = await res.json();

	return result;
}